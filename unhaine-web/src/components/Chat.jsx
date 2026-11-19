import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import ChatMessage from "./ChatMessage";
import { readChatStream } from "../lib/chat-stream";

const CHAT_API_URL =
  import.meta.env.VITE_CHAT_API_URL ||
  (import.meta.env.DEV
    ? "/chat-api/chat"
    : "https://unhaine-chat-api.ultrasaram.workers.dev/chat");
const CHAT_HEALTH_URL = CHAT_API_URL.startsWith("/")
  ? "/chat-api/health"
  : new URL("health", CHAT_API_URL).href;

function Symbol({ size = 22, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4L18.4 5.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Chat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [connection, setConnection] = useState("disconnected");
  const [hintVisible, setHintVisible] = useState(true);
  const cancelConnectionCheck = useRef(null);
  const { pathname } = useLocation();
  const sending = useRef(false);
  const requestController = useRef(null);
  const mounted = useRef(false);
  const launch = useRef(null);
  const textarea = useRef(null);
  const body = useRef(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setConnection("checking");
    const timeout = setTimeout(() => {
      if (active) setConnection("disconnected");
      controller.abort();
    }, 8000);
    const cancel = () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
    cancelConnectionCheck.current = cancel;
    fetch(CHAT_HEALTH_URL, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        const health = response.ok ? await response.json() : null;
        if (active)
          setConnection(health?.ready === true ? "connected" : "disconnected");
      })
      .catch(() => {
        if (active && !controller.signal.aborted) setConnection("disconnected");
      })
      .finally(() => clearTimeout(timeout));
    const offline = () => setConnection("disconnected");
    window.addEventListener("offline", offline);
    return () => {
      cancel();
      window.removeEventListener("offline", offline);
    };
  }, [open]);

  useEffect(() => {
    if (!hintVisible || connection !== "connected" || open) return;
    const timeout = setTimeout(() => setHintVisible(false), 7000);
    return () => clearTimeout(timeout);
  }, [hintVisible, connection, open]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      requestController.current?.abort();
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("chat-open", open);
    if (open) textarea.current.focus();
    const closeOnEscape = (event) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        launch.current.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("chat-open");
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  useLayoutEffect(() => {
    textarea.current.style.height = "auto";
    textarea.current.style.height = `${Math.min(textarea.current.scrollHeight, 160)}px`;
  }, [input, open]);

  useEffect(() => {
    body.current.scrollTop = body.current.scrollHeight;
  }, [messages, open, pending, error]);

  async function send(event) {
    event.preventDefault();
    const question = input.trim();
    if (!question || sending.current) return;
    cancelConnectionCheck.current?.();
    sending.current = true;
    setPending(true);
    setError("");
    const history = messages.filter(message => !message.incomplete).slice(-8).map((message) => ({
      role: message.kind === "user" ? "user" : "assistant",
      text: message.text.slice(0, 4000),
    }));
    setMessages((previous) => [...previous,
      { kind: "user", text: question },
      { kind: "bot", text: "", streaming: true },
    ]);
    setInput("");
    const controller = new AbortController();
    requestController.current = controller;
    const timeout = setTimeout(() => controller.abort(), 65_000);
    let receivedText = "";
    const updateAnswer = (text) => {
      receivedText = text;
      if (!mounted.current) return;
      setConnection("connected");
      setMessages(previous => previous.map((message, index) =>
        index === previous.length - 1 ? { ...message, text } : message));
    };
    try {
      const response = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
        body: JSON.stringify({ question, page: pathname, history }),
        signal: controller.signal,
      });
      if (response.ok && response.headers.get("Content-Type")?.includes("text/event-stream")) {
        await readChatStream(response.body, updateAnswer, controller.signal);
      } else {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "답변을 가져오지 못했습니다.");
        if (typeof result.text !== "string" || !result.text.trim())
          throw new Error("답변을 가져오지 못했습니다.");
        updateAnswer(result.text);
      }
      if (mounted.current) setMessages(previous => previous.map((message, index) =>
        index === previous.length - 1 ? { ...message, streaming: false } : message));
    } catch (failure) {
      if (!mounted.current) return;
      setConnection("disconnected");
      setMessages(previous => receivedText
        ? previous.map((message, index) => index >= previous.length - 2
          ? { ...message, streaming: false, incomplete: true } : message)
        : previous.slice(0, -2));
      setInput(question);
      setError(
        failure.name === "AbortError"
          ? "답변이 지연되고 있습니다. 다시 시도해 주세요."
          : failure instanceof TypeError
            ? "챗에 연결하지 못했습니다. 인터넷 연결을 확인하고 다시 시도해 주세요."
            : failure.message,
      );
    } finally {
      clearTimeout(timeout);
      sending.current = false;
      if (mounted.current) setPending(false);
      requestController.current = null;
    }
  }

  const connectionLabel =
    connection === "connected"
      ? "AI 연결됨"
      : connection === "checking"
        ? "AI 연결 확인 중"
        : "AI 연결 확인 필요";
  const showHint = hintVisible && connection === "connected" && !open;

  return (
    <>
      <button
        ref={launch}
        className="chat-launch"
        id="chat-launch"
        aria-label="챗 열기"
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-describedby={showHint ? "chat-invite" : undefined}
        data-connected={connection === "connected"}
        title={`챗 열기 · ${connectionLabel}`}
        onClick={() => {
          setHintVisible(false);
          setOpen(!open);
        }}
      >
        <Symbol size={20} />
      </button>
      {showHint && (
        <div className="chat-invite" id="chat-invite" role="status">
          궁금한 점을 물어보세요
        </div>
      )}
      <section
        className={`chat-panel${open ? " open" : ""}`}
        id="chat-panel"
        aria-label="챗"
        inert={!open}
      >
        <div className="chat-head">
          <span
            className="chat-connection"
            data-connected={connection === "connected"}
            role="status"
            title={connectionLabel}
          >
            <Symbol />
            <span className="sr-only">{connectionLabel}</span>
          </span>
          <div className="chat-head-actions">
            <button
              type="button"
              className="chat-close chat-reset"
              aria-label="새 대화 시작"
              title="새 대화 시작"
              disabled={pending}
              onClick={() => {
                if (sending.current) return;
                setMessages([]);
                setInput("");
                setError("");
                textarea.current.focus();
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 7v5h-5" />
                <path d="M20 12a8 8 0 1 0-2.3 5.7" />
              </svg>
            </button>
            <button
              className="chat-close"
              aria-label="챗 닫기"
              onClick={() => {
                setOpen(false);
                launch.current.focus();
              }}
            >
              ×
            </button>
          </div>
        </div>
        <div
          ref={body}
          className="chat-body"
          id="chat-body"
          role="log"
          aria-label="대화 내용"
          aria-live="polite"
          aria-busy={pending}
        >
          {messages.length ? (
            messages.map((message, index) => (
              <div key={index} className={`bubble ${message.kind}`}>
                {message.kind === "bot" ? (
                  message.streaming && !message.text ? (
                    <span className="chat-pending" role="status">
                      <span className="chat-pending-text">답변을 준비하고 있어요</span>
                      <span className="chat-pending-dots" aria-hidden="true"><i /><i /><i /></span>
                    </span>
                  ) : <ChatMessage text={message.text} />
                ) : (
                  message.text
                )}
              </div>
            ))
          ) : (
            <div className="chat-placeholder">
              <Symbol size={48} className="chat-placeholder-icon" />
              <p>무엇이 궁금하신가요?</p>
              <span className="chat-intro">
                경력, 프로젝트, 일하는 방식에 대해 물어보세요.
              </span>
            </div>
          )}

        </div>
        {error && (
          <p className="chat-error" role="alert">
            {error}
          </p>
        )}
        <form className="chat-form" id="chat-form" onSubmit={send}>
          <textarea
            ref={textarea}
            id="chat-input"
            rows={1}
            placeholder="Ask Me Anything!"
            aria-label="질문 입력"
            value={input}
            maxLength={2000}
            readOnly={pending}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing &&
                event.keyCode !== 229
              )
                send(event);
            }}
          />
          <div className="chat-form-actions">
            <button
              type="submit"
              aria-label="메시지 보내기"
              disabled={pending || !input.trim()}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 19V5m-6 6 6-6 6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
