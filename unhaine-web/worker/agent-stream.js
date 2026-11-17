import { readEventStream } from "../shared/event-stream.js";

export async function readAgentAnswer(body, onSession, onText = () => {}, signal) {
  const parts = new Map();
  let completed = false;
  await readEventStream(body, async event => {
    if (event.type === "agent.session.created") onSession(event.session.id);
    const key = `${event.item_id}:${event.content_index}`;
    const delta = event.type === "agent.session.turn.output_text.delta";
    const done = event.type === "agent.session.turn.output_text.done";
    if (delta) parts.set(key, (parts.get(key) || "") + event.delta);
    if (done) parts.set(key, event.text);
    if (delta || done) {
      const text = [...parts.values()].join("\n\n");
      if (text.length > 16_000) throw new Error("Output too large");
      await onText(text);
    }
    if (["agent.session.turn.failed", "agent.session.turn.cancelled",
      "agent.session.failed", "agent.session.environment.failed", "error"].includes(event.type))
      throw new Error("Agent turn failed");
    if (event.type === "agent.session.turn.completed") {
      completed = true;
      return true;
    }
  }, signal);
  const text = [...parts.values()].join("\n\n").trim();
  if (!completed || !text) throw new Error("Incomplete agent answer");
  return text;
}
