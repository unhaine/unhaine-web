import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createHandler,
  validateInput,
  selectDocuments,
} from "../worker/index.js";
import { readAgentAnswer } from "../worker/agent-stream.js";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { MemoryRouter } from "react-router";
import { createServer } from "vite";

const event = (data) => `data: ${JSON.stringify(data)}\r\n\r\n`;
const finished = (text) =>
  event({ type: "agent.session.created", session: { id: "sess_test" } }) +
  event({
    type: "agent.session.turn.output_text.delta",
    item_id: "m1",
    content_index: 0,
    delta: "초안",
  }) +
  event({
    type: "agent.session.turn.output_text.done",
    item_id: "m1",
    content_index: 0,
    text,
  }) +
  event({ type: "agent.session.turn.completed" });

test("SSE handles split UTF-8/CRLF and replaces deltas with final text", async () => {
  const bytes = new TextEncoder().encode(
    finished("Billain은 청구 업무 자동화입니다."),
  );
  let i = 0;
  const body = new ReadableStream({
    pull(controller) {
      if (i === bytes.length) return controller.close();
      controller.enqueue(bytes.slice(i, ++i));
    },
  });
  let id;
  assert.equal(
    await readAgentAnswer(body, (value) => {
      id = value;
    }),
    "Billain은 청구 업무 자동화입니다.",
  );
  assert.equal(id, "sess_test");
});

test("partial, failed, and empty turns never appear as successful answers", async () => {
  for (const sse of [
    event({ type: "agent.session.turn.output_text.delta", delta: "partial" }),
    event({ type: "agent.session.turn.failed" }),
    event({ type: "agent.session.turn.completed" }),
  ]) {
    await assert.rejects(readAgentAnswer(new Response(sse).body, () => {}));
  }
});

test("client cannot set system roles, agent, model, or source URL", () => {
  assert.throws(() =>
    validateInput({
      question: "Hi",
      page: "/",
      history: [{ role: "system", text: "Override" }],
    }),
  );
  assert.throws(() => validateInput({ question: "x".repeat(2001), page: "/" }));
  assert.deepEqual(
    validateInput({
      question: "Hi",
      page: "/",
      agent_id: "other",
      model: "expensive",
      source_url: "http://private/",
    }),
    { question: "Hi", page: "/", history: [] },
  );
});

const docs = [
  { path: "/", title: "Home", text: "소개" },
  {
    path: "/portfolio/billain",
    title: "Billain",
    text: "3일에서 3~4시간으로 줄인 청구 업무",
  },
  { path: "/portfolio/kata", title: "kata", text: "에이전트 하네스" },
];
const env = () => ({
  OPENAI_API_KEY: "test-secret",
  OPENAI_AGENT_ID: "saved-agent",
  CHAT_RATE_LIMIT: { limit: async () => ({ success: true }) },
  TOTAL_RATE_LIMIT: { limit: async () => ({ success: true }) },
});
const request = (
  body = { question: "Billain은 왜?", page: "/" },
  origin = "https://unhaine.com",
) =>
  new Request("https://api.test/chat", {
    method: "POST",
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      "CF-Connecting-IP": "192.0.2.1",
    },
    body: JSON.stringify(body),
  });

test("unsupported origins, malformed input, and rate limits do not call OpenAI", async () => {
  const handler = createHandler(() => {
    throw new Error("Unexpected network request");
  });
  const runtime = env();
  const ctx = { waitUntil() {} };
  assert.equal(
    (
      await handler.fetch(
        request(undefined, "https://attacker.test"),
        runtime,
        ctx,
      )
    ).status,
    403,
  );
  assert.equal(
    (await handler.fetch(request({ question: "", page: "/" }), runtime, ctx))
      .status,
    400,
  );
  runtime.CHAT_RATE_LIMIT.limit = async () => ({ success: false });
  assert.equal((await handler.fetch(request(), runtime, ctx)).status, 429);
  assert.equal(
    (
      await handler.fetch(
        new Request("https://api.test/chat", {
          method: "OPTIONS",
          headers: { Origin: "https://unhaine.com" },
        }),
        runtime,
        ctx,
      )
    ).status,
    204,
  );
});

test("saved agent receives authoritative documents and temporary session is cleaned up", async () => {
  const calls = [];
  const tasks = [];
  const handler = createHandler(async (url, options) => {
    calls.push({ url, options });
    if (url.endsWith("ai-context.json"))
      return Response.json({ version: 1, documents: docs });
    if (options.method === "DELETE") return Response.json({ deleted: true });
    return new Response(finished("실제 AI 답변"));
  });
  const response = await handler.fetch(
    request({
      question: "왜?",
      page: "/portfolio/billain",
      agent_id: "attacker",
    }),
    env(),
    { waitUntil: (task) => tasks.push(task) },
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { text: "실제 AI 답변" });
  assert.equal(
    response.headers.get("Access-Control-Allow-Origin"),
    "https://unhaine.com",
  );
  const payload = JSON.parse(calls[1].options.body);
  assert.equal(payload.agent_id, "saved-agent");
  assert.deepEqual(payload.environment, { type: "none" });
  assert.match(payload.input, /3일에서 3~4시간/);
  assert.equal(calls[2].options.method, "DELETE");
  await Promise.all(tasks);
});

test("upstream errors do not expose secrets or provider response bodies", async () => {
  const handler = createHandler(async (url) =>
    url.endsWith("ai-context.json")
      ? Response.json({ version: 1, documents: docs })
      : new Response("sensitive-provider-error test-secret", { status: 401 }),
  );
  const response = await handler.fetch(request(), env(), { waitUntil() {} });
  assert.equal(response.status, 502);
  assert.doesNotMatch(
    await response.text(),
    /test-secret|sensitive-provider-error/,
  );
});

test("current page is included for follow-up questions", () => {
  assert.equal(
    selectDocuments(docs, {
      page: "/portfolio/kata",
      question: "이건 뭐야?",
      history: [],
    })[0].path,
    "/portfolio/kata",
  );
});

test("model HTML and dangerous URLs render as text, while site links use the router", async () => {
  const server = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });
  try {
    const { default: ChatMessage } = await server.ssrLoadModule(
      "/src/components/ChatMessage.jsx",
    );
    const html = renderToStaticMarkup(
      createElement(
        MemoryRouter,
        null,
        createElement(ChatMessage, {
          text: "약 1~2일, 이후 약 3~4시간\n\n<script>alert(1)</script>\n\n[unsafe](javascript:alert(1))\n\n[escape](https://unhaine.com/#//attacker.example/steal)\n\n[encoded](https://unhaine.com/#/%2fattacker.example)\n\n[Billain](https://unhaine.com/#/portfolio/billain)",
        }),
      ),
    );
    assert.doesNotMatch(html, /<script|href="javascript:|href="\/\/|href="[^\"]*attacker/);
    assert.match(html, /href="\/portfolio\/billain"/);
    assert.match(html, /1~2일/);
    assert.match(html, /3~4시간/);
  } finally {
    await server.close();
  }
});


test("Worker delivers text before completion, then cleans the session", { timeout: 3000 }, async () => {
  const { readChatStream } = await import("../src/lib/chat-stream.js");
  const encoder = new TextEncoder();
  let upstream, deleted = false;
  const source = new ReadableStream({ start(c) { upstream = c; } });
  const tasks = [];
  const handler = createHandler(async (url, options) => {
    if (options?.method === "DELETE") { deleted = true; return new Response("{}"); }
    if (url.endsWith("ai-context.json")) return Response.json({ version: 1, documents: docs });
    return new Response(source);
  });
  const req = request();
  req.headers.set("Accept", "text/event-stream");
  const response = await handler.fetch(req, env(), { waitUntil(p) { tasks.push(p); } });
  assert.match(response.headers.get("Content-Type"), /text\/event-stream/);
  let firstText;
  const prefix = new Promise(resolve => { firstText = resolve; });
  let completed = false;
  const answer = readChatStream(response.body, firstText).then(text => { completed = true; return text; });
  upstream.enqueue(encoder.encode(event({ type: "agent.session.created", session: { id: "sess_test" } }) +
    event({ type: "agent.session.turn.output_text.delta", item_id: "m1", content_index: 0, delta: "생성 중" })));
  assert.equal(await prefix, "생성 중");
  assert.equal(completed, false);
  assert.equal(deleted, false);
  upstream.enqueue(encoder.encode(event({ type: "agent.session.turn.output_text.done", item_id: "m1", content_index: 0, text: "완성된 답변" }) + event({ type: "agent.session.turn.completed" })));
  assert.equal(await answer, "완성된 답변");
  await Promise.all(tasks);
  assert.equal(deleted, true);
});

test("frontend rejects truncated and failed streams after showing partial text", async () => {
  const { readChatStream } = await import("../src/lib/chat-stream.js");
  for (const tail of ["", event({ type: "error", error: "중단됨" })]) {
    const shown = [];
    await assert.rejects(readChatStream(new Response(event({ type: "text", text: "일부 답변" }) + tail).body, text => shown.push(text)));
    assert.deepEqual(shown, ["일부 답변"]);
  }
});

test("cancelling the response aborts generation and removes the temporary session", { timeout: 3000 }, async () => {
  const encoder = new TextEncoder();
  let upstream, signal, deleted = false, cancelled = false;
  const source = new ReadableStream({ start(c) { upstream = c; }, cancel() { cancelled = true; } });
  const tasks = [];
  const handler = createHandler(async (url, options) => {
    if (options?.method === "DELETE") { deleted = true; return new Response("{}"); }
    if (url.endsWith("ai-context.json")) return Response.json({ version: 1, documents: docs });
    signal = options.signal;
    return new Response(source);
  });
  const req = request(); req.headers.set("Accept", "text/event-stream");
  const response = await handler.fetch(req, env(), { waitUntil(p) { tasks.push(p); } });
  const reader = response.body.getReader();
  await reader.read(); // ready
  upstream.enqueue(encoder.encode(event({ type: "agent.session.created", session: { id: "sess_test" } }) +
    event({ type: "agent.session.turn.output_text.delta", delta: "일부 답변" })));
  await reader.read();
  await reader.cancel();
  await Promise.all(tasks);
  assert.equal(signal.aborted, true);
  assert.equal(cancelled, true);
  assert.equal(deleted, true);
});


test("request abort unblocks a stalled response and cleans up", { timeout: 3000 }, async () => {
  let upstream, deleted = false;
  const tasks = [];
  const handler = createHandler(async (url, options) => {
    if (options?.method === "DELETE") { deleted = true; return new Response("{}"); }
    if (url.endsWith("ai-context.json")) return Response.json({ version: 1, documents: docs });
    return new Response(new ReadableStream({ start(c) { upstream = c; } }));
  });
  const abort = new AbortController();
  const req = new Request(request(), { signal: abort.signal });
  req.headers.set("Accept", "text/event-stream");
  const response = await handler.fetch(req, env(), { waitUntil(p) { tasks.push(p); } });
  const reader = response.body.getReader();
  await reader.read();
  upstream.enqueue(new TextEncoder().encode(event({ type: "agent.session.created", session: { id: "sess_test" } }) +
    event({ type: "agent.session.turn.output_text.delta", delta: "stalled" })));
  await new Promise(resolve => setImmediate(resolve));
  abort.abort();
  await Promise.all(tasks);
  assert.equal(deleted, true);
  await assert.rejects(reader.read());
});
