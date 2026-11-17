import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { getAnswer } from "../data/chat";

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
  const launch = useRef(null);
  const textarea = useRef(null);
  const body = useRef(null);

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
  }, [messages, open]);

  function send(event) {
    event.preventDefault();
    const question = input.trim();
    if (!question) return;
    setMessages((previous) => [
      ...previous,
      { kind: "user", text: question },
      { kind: "bot", ...getAnswer(question) },
    ]);
    setInput("");
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
        >
          {messages.length ? (
            messages.map((message, index) => (
              <div key={index} className={`bubble ${message.kind}`}>
                {message.text}
                {message.url && (
                  <Link to={message.url} className="chat-answer-link">
                    {message.label} ↗
                  </Link>
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
              <p>On Construction</p>
            </div>
          )}
        </div>
        <form className="chat-form" id="chat-form" onSubmit={send}>
          <textarea
            ref={textarea}
            id="chat-input"
            rows={1}
            placeholder="Ask Me Anything!"
            aria-label="질문 입력"
            value={input}
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
              disabled={!input.trim()}
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
