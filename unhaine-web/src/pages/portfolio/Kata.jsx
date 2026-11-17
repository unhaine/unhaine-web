import { Link } from "react-router";
import usePageMeta from "../../hooks/usePageMeta";
import Gallery from "../../components/Gallery";

export default function Kata() {
  usePageMeta(
    "kata",
    "kata-page project-detail-page document-page overview-page chat-enabled",
  );
  return (
    <>
      <div className="document-layout">
        <aside className="detail-sidebar">
          <Link className="detail-parent" to={"/portfolio"}>
            ← Portfolio
          </Link>
          <nav className="detail-nav" aria-label="프로젝트 메뉴">
            <Link to={"/portfolio/billain"}>
              <span>01</span>
              Billain
            </Link>
            <Link to={"/portfolio/kata"} className="active" aria-current="page">
              <span>02</span>
              kata
            </Link>
          </nav>
        </aside>
        <div className="detail-content">
          <header className="detail-heading">
            <h1>
              kata
              <span className="period">.</span>
            </h1>
            <p className="case-subtitle">
              AI Agent Harness &amp; Orchestration
            </p>
          </header>
          <Gallery
            className="project-gallery kata-screenshot"
            slides={[
              {
                src: "assets/kata/harness-developer.jpg",
                alt: "kata의 Harness 편집 화면. Developer 에이전트의 지침, 작업 흐름과 연결된 역량을 관리합니다.",
                title: "kata Harness",
                width: 2880,
                height: 1620,
              },
            ]}
          >
            <figcaption className="kata-introduction">
              <h2>작업의 흔적에 형태를 부여하다</h2>
              <p>
                에이전트가 휘몰아치고 간 자리엔 작업 결과물은 남지만, 작업
                방식과 경험은 남지 않습니다.
              </p>
              <p>
                <strong>
                  kata는 흩어지는 작업의 흔적에 형태를 부여하고, 그 형태를
                  쌓아가며 끊임없이 발전시키고자 시작한 프로젝트입니다.
                </strong>
              </p>
            </figcaption>
          </Gallery>
          <section className="case-sections" aria-label="프로젝트 상세">
            <article className="case-article">
              <span className="detail-label">01 / WHY kata?</span>
              <div>
                <h2>왜 직접 만들려고 할까?</h2>
                <div className="kata-question">
                  <h3>“요즘은 오히려 하네스를 걷어내는 추세라던데요?”</h3>
                  <p>
                    저 역시 똑똑해진 에이전트의 능력을 불필요하게 제한하고
                    싶지는 않습니다. 그들이 남긴 경험과 지식을
                    <strong>저만의 자산으로 만들고 싶었습니다.</strong>
                  </p>
                </div>
                <div className="kata-question">
                  <h3>“Herdr나 Orca 같은 도구를 사용하면 되지 않나요?”</h3>
                  <p>
                    kata는 하네스보다 넓은 관점에서 출발했습니다. 회사가 직원이
                    바뀌어도 업무 체계를 이어가듯, 저만의 작업 체계 관리
                    시스템을 만들고 발전시키고 싶었습니다.
                  </p>
                </div>
              </div>
            </article>
            <article className="case-article">
              <span className="detail-label">02 / CONCEPT</span>
              <div>
                <h2>무엇을 남길 것인가?</h2>
                <div className="kata-concepts">
                  <div>
                    <h3>
                      Project
                      <span>프로젝트의 맥락</span>
                    </h3>
                    <p>목표와 진행 과정, 의사결정을 기록하고 이어갑니다.</p>
                  </div>
                  <div>
                    <h3>
                      Harness
                      <span>작업의 방식</span>
                    </h3>
                    <p>실행 흐름과 검증 체계를 관리하고 개선합니다.</p>
                  </div>
                  <div>
                    <h3>
                      Resources
                      <span>작업의 자산</span>
                    </h3>
                    <p>문서, 코드, 도구와 산출물을 관리하고 재사용합니다.</p>
                  </div>
                  <div>
                    <h3>
                      References
                      <span>지식의 근거</span>
                    </h3>
                    <p>참고 자료와 지식을 연결하고 활용합니다.</p>
                  </div>
                </div>
              </div>
            </article>
            <article className="case-article">
              <span className="detail-label">03 / EVOLUTION</span>
              <div>
                <h2>축적에서 발전으로</h2>
                <div className="kata-evolution">
                  <ol className="kata-cycle" aria-label="작업 체계의 발전 흐름">
                    <li>
                      <span aria-hidden="true">01</span>
                      실행
                    </li>
                    <li>
                      <span aria-hidden="true">02</span>
                      기록
                    </li>
                    <li>
                      <span aria-hidden="true">03</span>
                      검토
                    </li>
                    <li>
                      <span aria-hidden="true">04</span>
                      개선
                    </li>
                    <li>
                      <span aria-hidden="true">05</span>
                      재사용
                    </li>
                  </ol>
                  <div className="kata-cycle-return" aria-hidden="true">
                    <span>↶</span>
                  </div>
                  <p>
                    작업을 거듭하며 쌓인 경험이 다음 작업의 기반이 되고, 저만의
                    작업 체계도 함께 발전하도록 설계하고 있습니다.
                  </p>
                </div>
              </div>
            </article>
            <article className="case-article">
              <span className="detail-label">04 / STORY</span>
              <div>
                <h2>관련 이야기</h2>
                <p>
                  <Link className="text-link" to={"/blog/kata"}>
                    만들고 있는데, 아직 어렵습니다 — kata ↗
                  </Link>
                </p>
              </div>
            </article>
          </section>
        </div>
      </div>
    </>
  );
}
