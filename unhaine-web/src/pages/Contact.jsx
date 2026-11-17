import usePageMeta from "../hooks/usePageMeta";
import CopyEmail from "../components/CopyEmail";

export default function Contact() {
  usePageMeta("Contact", "contact-page overview-page chat-enabled");
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">04 / CONTACT</span>
        <h1>
          Exploring what’s next.
          <br />
          <em>Building it together.</em>
        </h1>
        <p className="lead">
          함께 풀어볼 문제와 새로운 기회,
          <br className="intro-break" />
          협업에 관한 이야기를 기다립니다.
        </p>
      </div>
      <section className="contact-actions" aria-label="연락 및 프로필">
        <ul className="contact-channels">
          <li className="contact-row">
            <CopyEmail
              type="button"
              address={"ultrasaram@gmail.com"}
              aria-label="이메일 주소 복사: ultrasaram@gmail.com"
              title="이메일 주소 복사"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                <path d="m3 7 9 6 9-6"></path>
              </svg>
              <span>ultrasaram@gmail.com</span>
              <span className="contact-action-icon" aria-hidden="true">
                <svg
                  className="copy-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="9" y="9" width="12" height="12" rx="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <svg
                  className="copy-check"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m5 12 4 4L19 6"></path>
                </svg>
              </span>
            </CopyEmail>
          </li>
          <li className="contact-row">
            <a
              className="contact-address"
              href="https://github.com/unhaine"
              aria-label="GitHub: unhaine (새 탭에서 열기)"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path
                  d="M9 19c-4.3 1.3-4.3-2.2-6-2.7M15 22v-3.9a3.4 3.4 0 0 0-.9-2.7c3-.3 6.2-1.5 6.2-6.9A5.4 5.4 0 0 0 18.8 4a5 5 0 0 0-.1-3.5S17.5.1 15 1.8a13.4 13.4 0 0 0-7 0C5.5.1 4.3.5 4.3.5A5 5 0 0 0 4.2 4a5.4 5.4 0 0 0-1.5 3.8c0 5.4 3.2 6.6 6.2 6.9A3.4 3.4 0 0 0 8 17.4V22"
                  transform="translate(1 1) scale(.9)"
                ></path>
              </svg>
              <span>github.com/unhaine</span>
              <span className="contact-action-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h6v6M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"></path>
                </svg>
              </span>
            </a>
            <p className="contact-note">
              올려는 뒀는데… 아직 볼만한 건 없습니다…
            </p>
          </li>
        </ul>
        <p className="contact-copy-status" role="status" aria-live="polite"></p>
      </section>
    </>
  );
}
