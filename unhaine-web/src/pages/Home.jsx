import { Link } from "react-router";
import usePageMeta from "../hooks/usePageMeta";

export default function Home() {
  usePageMeta("Main", "home-page overview-page chat-enabled");
  return (
    <>
      <section className="hero">
        <div className="home-intro page-heading">
          <div className="eyebrow">
            <span className="dot"></span>
            BUSINESS × TECHNOLOGY × AI
          </div>
          <h1>
            Finding the problem.
            <br />
            <em>Building the solution.</em>
          </h1>
        </div>
        <p className="lead home-summary">
          기술의 발전은 우리가 일하는 방식을 바꾸고 있습니다.
        </p>
        <div className="home-welcome">
          <p>
            저는 그 변화 속에서 새로운 가능성을 발견하고, 스스로의 역할을
            넓혀가는 사람이고 싶습니다.
          </p>
          <p>
            비즈니스 현장에서 쌓은 경험을 바탕으로 기술을 탐구하며, 이전에는
            해결하기 어려웠던 문제들에 도전하고 있습니다.
          </p>
          <p>
            이곳은 제가 걸어온 길과 그 과정에서 얻은 생각, 그리고 새로운 도전을
            담아가는 공간입니다.
          </p>
          <p>
            자유롭게 둘러보시고, 궁금한 점이 있다면{" "}
            <Link to={"/contact"}>편하게 연락 주세요.</Link>
          </p>
        </div>
        <div className="actions">
          <Link className="btn primary" to={"/about"}>
            Who I am
            <span>↗</span>
          </Link>
          <Link className="btn ghost" to={"/portfolio"}>
            View my work
            <span>↗</span>
          </Link>
        </div>
        <div className="home-illustration" aria-hidden="true">
          <img
            src="assets/home/robot-lamplighter.png"
            alt=""
            width="1024"
            height="1536"
            decoding="async"
          />
        </div>
      </section>
    </>
  );
}
