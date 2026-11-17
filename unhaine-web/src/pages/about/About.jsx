import { Link } from "react-router";
import usePageMeta from "../../hooks/usePageMeta";

export default function About() {
  usePageMeta("About", "about-page overview-page chat-enabled");
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">01 / ABOUT</span>
        <h1>
          From business insight
          <br />
          <em>to AI engineering.</em>
        </h1>
        <p className="lead">
          비즈니스에서 출발해 기술로 확장해 온 경험과,
          <br className="intro-break" />그 과정에서 쌓은 역량과 일하는 방식을
          소개합니다.
        </p>
      </div>
      <div className="tile-grid">
        <Link className="info-tile" to={"/about/career"}>
          <span>01 / EXPERIENCE</span>
          <h2>
            <svg
              className="tile-icon"
              aria-hidden="true"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 12h.01"></path>
              <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>
              <path d="M22 13a18.15 18.15 0 0 1-20 0"></path>
              <rect width="20" height="14" x="2" y="6" rx="2"></rect>
            </svg>
            Career
          </h2>
          <p>비즈니스 현장에서 쌓은 역할과 경험</p>
          <b>Explore ↗</b>
        </Link>
        <Link className="info-tile" to={"/about/education"}>
          <span>02 / LEARNING</span>
          <h2>
            <svg
              className="tile-icon"
              aria-hidden="true"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
              <path d="M22 10v6"></path>
              <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
            </svg>
            Education
          </h2>
          <p>학력, 교육 과정, 지속적인 학습</p>
          <b>Explore ↗</b>
        </Link>
        <Link className="info-tile" to={"/about/values"}>
          <span>03 / PRINCIPLES</span>
          <h2>
            <svg
              className="tile-icon"
              aria-hidden="true"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path>
            </svg>
            Values
          </h2>
          <p>일을 대하는 태도와 협업 원칙</p>
          <b>Explore ↗</b>
        </Link>
      </div>
    </>
  );
}
