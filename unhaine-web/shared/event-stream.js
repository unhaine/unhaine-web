// SSE frames and UTF-8 characters may span multiple network chunks.
export async function readEventStream(body, onEvent, signal) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "", bytes = 0;
  const abort = () => { reader.cancel().catch(() => {}); };
  signal?.addEventListener("abort", abort, { once: true });
  async function consume(frame) {
    const data = frame.split("\n").filter(line => line.startsWith("data:"))
      .map(line => line.slice(5).trimStart()).join("\n");
    if (data && data !== "[DONE]") return onEvent(JSON.parse(data));
  }
  try {
    while (true) {
      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
      const { value, done } = await reader.read();
      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
      if (done) {
        buffer += decoder.decode();
        if (buffer.trim()) await consume(buffer);
        return;
      }
      bytes += value.byteLength;
      if (bytes > 1_000_000) throw new Error("Stream too large");
      buffer += decoder.decode(value, { stream: true });
      buffer = buffer.replace(/\r\n/g, "\n");
      let boundary;
      while ((boundary = buffer.indexOf("\n\n")) !== -1) {
        const frame = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        if (await consume(frame)) return;
      }
      if (buffer.length > 128_000) throw new Error("Event too large");
    }
  } finally {
    signal?.removeEventListener("abort", abort);
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
