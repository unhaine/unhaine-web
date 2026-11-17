import { Link } from "react-router";
import usePageMeta from "../../hooks/usePageMeta";

export default function Education() {
  usePageMeta(
    "Education",
    "education-page about-detail-page document-page overview-page chat-enabled",
  );
  return (
    <>
      <div className="document-layout">
        <aside className="detail-sidebar">
          <Link className="detail-parent" to={"/about"}>
            ← About
          </Link>
          <nav className="detail-nav" aria-label="About 하위 페이지">
            <Link to={"/about/career"}>
              <span>01</span>
              Career
            </Link>
            <Link
              to={"/about/education"}
              className="active"
              aria-current="page"
            >
              <span>02</span>
              Education
            </Link>
            <Link to={"/about/values"}>
              <span>03</span>
              Values
            </Link>
          </nav>
        </aside>
        <div className="detail-content">
          <header className="detail-heading">
            <h1>
              Education
              <span className="period">.</span>
            </h1>
            <p>
              전공에서 시작한 배움을 새로운 관심으로 이어가며,
              <br className="intro-break" />
              필요한 지식을 익히고 실제 작업에 적용하고 있습니다.
            </p>
          </header>
          <section className="detail-list" aria-label="education 목록">
            <article className="detail-item">
              <span className="detail-label">UNIVERSITY</span>
              <div>
                <div className="education-heading">
                  <h2>광운대학교 · 영어영문학과</h2>
                  <p className="detail-meta">2007.03 — 2015.02</p>
                </div>
                <p>언어와 커뮤니케이션에 대한 학문적 배경을 쌓았습니다.</p>
              </div>
            </article>
            <article className="detail-item">
              <span className="detail-label">COURSE</span>
              <div className="course-list">
                <section className="course-entry">
                  <h2>재직자_INNER CIRCLE : 인공지능(AI) 마스터 Course</h2>
                  <p>패스트캠퍼스강남학원</p>
                  <p className="detail-meta">2025.11.10 — 2026.03.02</p>
                </section>
                <section className="course-entry">
                  <h2>ADsP(빅데이터준전문가) 최단기 합격패스</h2>
                  <p>패스트캠퍼스분점 원격평생교육원</p>
                  <p className="detail-meta">2025.09.03 — 2025.10.07</p>
                </section>
                <section className="course-entry">
                  <h2>
                    (산대특)업무자동화의 시작, A.I 만들기(이미지, 텍스트 생성)
                  </h2>
                  <p>더조은컴퓨터아카데미</p>
                  <p className="detail-meta">2025.03.15 — 2025.04.20</p>
                </section>
                <section className="course-entry">
                  <h2>파이썬 활용 머신러닝 실무</h2>
                  <p>더조은컴퓨터아카데미</p>
                  <p className="detail-meta">2025.02.01 — 2025.03.09</p>
                </section>
                <section className="course-entry">
                  <h2>
                    (산대특)디지털 업무전환을 위한 데이터 리터러시 입문과정
                  </h2>
                  <p>더조은컴퓨터아카데미</p>
                  <p className="detail-meta">2024.12.14 — 2025.01.19</p>
                </section>
              </div>
            </article>
            <article className="detail-item">
              <span className="detail-label">ONGOING</span>
              <div>
                <h2>비즈니스 운영의 새로운 가능성 탐구</h2>
                <p>
                  비즈니스의 복잡한 의사결정과 업무 흐름을 AI로 연결하고
                  개선하는 데 관심이 있으며,
                </p>
                <p>
                  이를 위한 에이전트 오케스트레이션과 시스템 아키텍처를 공부하고
                  있습니다.
                </p>
              </div>
            </article>
          </section>
        </div>
      </div>
    </>
  );
}
