import { useEffect, useRef, useState } from "react";

export default function CopyEmail({ address, children, ...props }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setError("");
      timer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setError("복사하지 못했습니다. 주소를 직접 선택해 복사해 주세요.");
    }
  }

  return (
    <>
      <button
        {...props}
        className={`contact-address${copied ? " is-copied" : ""}`}
        onClick={copy}
      >
        {children}
      </button>
      <span className="sr-only" role="status">
        {error || (copied ? "이메일 주소를 복사했습니다." : "")}
      </span>
    </>
  );
}
