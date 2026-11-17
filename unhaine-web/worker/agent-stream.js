// Parse SSE incrementally: network chunks need not align with event or UTF-8 boundaries.
export async function readAgentAnswer(body, onSession) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  const parts = new Map();
  let buffer = "";
  let bytes = 0;
  let completed = false;

  function consume(frame) {
    const data = frame
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .join("\n");
    if (!data || data === "[DONE]") return;
    const event = JSON.parse(data);
    if (event.type === "agent.session.created") onSession(event.session.id);
    const key = `${event.item_id}:${event.content_index}`;
    if (event.type === "agent.session.turn.output_text.delta") {
      parts.set(key, (parts.get(key) || "") + event.delta);
    }
    if (event.type === "agent.session.turn.output_text.done")
      parts.set(key, event.text);
    if ([...parts.values()].join("").length > 16_000)
      throw new Error("Output too large");
    if (event.type === "agent.session.turn.completed") completed = true;
    if (
      [
        "agent.session.turn.failed",
        "agent.session.turn.cancelled",
        "agent.session.failed",
        "error",
      ].includes(event.type)
    ) {
      throw new Error("Agent turn failed");
    }
  }

  try {
    while (!completed) {
      const { value, done } = await reader.read();
      if (done) {
        buffer += decoder.decode();
        if (buffer.trim()) consume(buffer);
        break;
      }
      bytes += value.byteLength;
      if (bytes > 1_000_000) throw new Error("Stream too large");
      buffer += decoder.decode(value, { stream: true });
      // Normalize only complete CRLF pairs; retain a trailing CR across chunks.
      buffer = buffer.replace(/\r\n/g, "\n");
      let boundary;
      while ((boundary = buffer.indexOf("\n\n")) !== -1) {
        consume(buffer.slice(0, boundary));
        buffer = buffer.slice(boundary + 2);
        if (completed) break;
      }
      if (buffer.length > 128_000) throw new Error("Event too large");
    }
    const text = [...parts.values()].join("\n\n").trim();
    if (!completed || !text) throw new Error("Incomplete agent answer");
    return text;
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
