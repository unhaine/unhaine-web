import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import ChatMessage from "./ChatMessage";

const CHAT_API_URL =
  import.meta.env.VITE_CHAT_API_URL ||
  "https://unhaine-chat-api.ultrasaram.workers.dev/chat";

function Symbol({ size = 22 }) {
  return (
    <svg
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
  const { pathname } = useLocation();
  const sending = useRef(false);
  const requestController = useRef(null);
  const mounted = useRef(false);
  const launch = useRef(null);
  const textarea = useRef(null);
  const body = useRef(null);

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
    sending.current = true;
    setPending(true);
    setError("");
    const history = messages.slice(-8).map((message) => ({
      role: message.kind === "user" ? "user" : "assistant",
      text: message.text.slice(0, 4000),
    }));
    setMessages((previous) => [...previous, { kind: "user", text: question }]);
    setInput("");
    const controller = new AbortController();
    requestController.current = controller;
    const timeout = setTimeout(() => controller.abort(), 65_000);
    try {
      const response = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, page: pathname, history }),
        signal: controller.signal,
      });
      const result = await response.json().catch(() => {
        throw new Error(
          "챗 서버의 응답을 읽지 못했습니다. 잠시 후 다시 시도해 주세요.",
        );
      });
      if (!response.ok)
        throw new Error(
          result.error || "답변을 가져오지 못했습니다. 다시 시도해 주세요.",
        );
      if (typeof result.text !== "string" || !result.text.trim())
        throw new Error("답변을 가져오지 못했습니다. 다시 시도해 주세요.");
      setMessages((previous) => [
        ...previous,
        { kind: "bot", text: result.text },
      ]);
    } catch (failure) {
      if (!mounted.current) return;
      setMessages((previous) => previous.slice(0, -1));
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

  return (
    <>
      <button
        ref={launch}
        className="chat-launch"
        id="chat-launch"
        aria-label="챗 열기"
        aria-expanded={open}
        aria-controls="chat-panel"
        onClick={() => setOpen(!open)}
      >
        <Symbol size={20} />
      </button>
      <section
        className={`chat-panel${open ? " open" : ""}`}
        id="chat-panel"
        aria-label="챗"
        inert={!open}
      >
        <div className="chat-head">
          <Symbol />
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
                  <ChatMessage text={message.text} />
                ) : (
                  message.text
                )}
              </div>
            ))
          ) : (
            <div className="chat-placeholder">
              <svg
                className="chat-placeholder-icon"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="10" rx="1" />
                <path d="m3 9 4-4m0 10L17 5m0 10 4-4M6 15v6m12-6v6" />
              </svg>
              <p>무엇이 궁금하신가요?</p>
              <span className="chat-intro">
                경력, 프로젝트, 일하는 방식에 대해 물어보세요.
              </span>
            </div>
          )}
          {pending && (
            <div className="bubble bot chat-pending" role="status">
              답변을 작성하고 있어요…
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
