import { Link } from "react-router";
import usePageMeta from "../../hooks/usePageMeta";

export default function Portfolio() {
  usePageMeta("Portfolio", "portfolio-page overview-page chat-enabled");
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">02 / PORTFOLIO</span>
        <h1>
          Turning ideas
          <br />
          <em>into working systems.</em>
        </h1>
        <p className="lead">
          업무 자동화부터 AI 에이전트까지,
          <br className="intro-break" />
          아이디어를 설계하고 구현하며 발전시킨 작업을 소개합니다.
        </p>
      </div>
      <div className="project-stack catalog">
        <Link className="project-card" to={"/portfolio/billain"}>
          <div className="project-visual billain-visual">
            <img
              className="project-cover"
              src="assets/billain/05-invoice-sample.jpg"
              width="1440"
              height="900"
              alt="가상 데이터로 구성한 Billain 청구서 출력 예시"
              decoding="async"
            />
          </div>
          <div className="project-meta">
            <div>
              <span className="eyebrow">01 / BUSINESS AUTOMATION</span>
              <h3>Billain</h3>
              <p>복잡한 청구 업무를 더 빠르고 일관된 웹 기반 업무 흐름으로.</p>
            </div>
            <span className="arrow">↗</span>
          </div>
        </Link>
        <Link className="project-card" to={"/portfolio/kata"}>
          <div className="project-visual kata-visual">
            <img
              className="project-logo"
              src="assets/kata/kata-mark-v2.png"
              width="1389"
              height="1132"
              alt="kata 로고"
              decoding="async"
            />
          </div>
          <div className="project-meta">
            <div>
              <span className="eyebrow">02 / AI ENGINEERING</span>
              <h3>kata</h3>
              <p>
                에이전트 오케스트레이션과 실행 과정 시각화를 탐구하는 시스템.
              </p>
            </div>
            <span className="arrow">↗</span>
          </div>
        </Link>
      </div>
    </>
  );
}
