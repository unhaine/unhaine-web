import { Link } from "react-router";
import usePageMeta from "../../hooks/usePageMeta";

export default function Values() {
  usePageMeta(
    "Values",
    "values-page about-detail-page document-page overview-page chat-enabled",
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
            <Link to={"/about/education"}>
              <span>02</span>
              Education
            </Link>
            <Link to={"/about/values"} className="active" aria-current="page">
              <span>03</span>
              Values
            </Link>
          </nav>
        </aside>
        <div className="detail-content">
          <header className="detail-heading">
            <h1>
              Values
              <span className="period">.</span>
            </h1>
            <p>
              무엇을 이루는가만큼,
              <br className="intro-break" />
              어떤 태도로 일하고 누구와 함께하는지도 중요하게 생각합니다.
            </p>
          </header>
          <section
            className="detail-list detail-values"
            aria-label="values 목록"
          >
            <article className="detail-item">
              <span className="detail-label">01</span>
              <div>
                <h2>결과에 집중하기</h2>
                <p>좋은 의도와 노력만으로는 충분하지 않다고 생각합니다.</p>
                <p>언제나 더 나은 완성도를 위해 꾸준히 고민하고 개선합니다.</p>
                <h3>관련 이야기</h3>
                <ul className="career-stories">
                  <li>
                    <Link
                      className="text-link"
                      to={"/blog/results-over-intentions"}
                    >
                      진심만으론 아무도 설득할 수 없다. ↗
                    </Link>
                  </li>
                </ul>
              </div>
            </article>
            <article className="detail-item">
              <span className="detail-label">02</span>
              <div>
                <h2>유연하게 생각하기</h2>
                <p>
                  하나의 생각이나 방식에 머무르지 않으려 합니다. 다양한 관점을
                  살피며 상황에 맞게 생각과 접근을 바꿉니다.
                </p>
                <h3>관련 이야기</h3>
                <ul className="career-stories">
                  <li>
                    <Link className="text-link" to={"/blog/expanding-tastes"}>
                      고집을 버린 건 아니고, 취향을 늘렸습니다 ↗
                    </Link>
                  </li>
                </ul>
              </div>
            </article>
            <article className="detail-item">
              <span className="detail-label">03</span>
              <div>
                <h2>주도적으로 해결하기</h2>
                <p>
                  역할을 따지기보다 문제를 해결할 방법부터 찾습니다. 필요한 일을
                  스스로 찾아 적극적으로 행동합니다.
                </p>
                <h3>관련 이야기</h3>
                <ul className="career-stories">
                  <li>
                    <Link className="text-link" to={"/blog/taking-initiative"}>
                      한 회사에서 우수사원만 세 번 ↗
                    </Link>
                  </li>
                </ul>
              </div>
            </article>
            <article className="detail-item">
              <span className="detail-label">04</span>
              <div>
                <h2>경험의 경계 넓히기</h2>
                <p>
                  익숙한 경험을 넘어 새로운 분야를 배우고 싶습니다. 다양한
                  도전으로 스스로의 가능성을 넓혀가고자 합니다.
                </p>
                <h3>관련 이야기</h3>
                <ul className="career-stories">
                  <li>
                    <Link className="text-link" to={"/blog/ai-journey"}>
                      영업을 그만두고 싶은 건 아니었습니다 ↗
                    </Link>
                  </li>
                </ul>
              </div>
            </article>
          </section>
        </div>
      </div>
    </>
  );
}
