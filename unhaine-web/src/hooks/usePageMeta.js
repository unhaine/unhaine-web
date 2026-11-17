import { useLayoutEffect } from "react";

export default function usePageMeta(title, className, description) {
  useLayoutEffect(() => {
    const previousClassName = document.body.className;
    document.body.className = `${className}${document.body.classList.contains("chat-open") ? " chat-open" : ""}`;
    document.title = `${title} | Unhaine`;
    const meta = document.querySelector('meta[name="description"]');
    meta.content =
      description || "Unhaine — 비즈니스, 소프트웨어, AI 엔지니어링 포트폴리오";
    return () => {
      const chatOpen = document.body.classList.contains("chat-open");
      document.body.className = previousClassName;
      document.body.classList.toggle("chat-open", chatOpen);
    };
  }, [title, className, description]);
}
