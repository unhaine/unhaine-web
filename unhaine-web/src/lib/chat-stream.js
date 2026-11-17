import { readEventStream } from "../../shared/event-stream.js";

export async function readChatStream(body, onText, signal) {
  let completed = false, text = "";
  await readEventStream(body, event => {
    if (event.type === "error") throw new Error(event.error || "답변 생성이 중단되었습니다.");
    if (event.type === "text" || event.type === "delta") {
      const value = event.type === "delta" ? event.delta : event.text;
      if (typeof value !== "string") throw new Error("답변을 읽지 못했습니다.");
      text = event.type === "delta" ? text + value : value;
      if (text.length > 16_000) throw new Error("답변이 너무 깁니다.");
      onText(text);
    }
    if (event.type === "done") { completed = true; return true; }
  }, signal);
  if (!completed || !text.trim()) throw new Error("답변 생성이 중단되었습니다. 다시 시도해 주세요.");
  return text;
}
