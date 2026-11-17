import { Link } from "react-router";
import usePageMeta from "../../hooks/usePageMeta";
import Gallery from "../../components/Gallery";

export default function Billain() {
  usePageMeta(
    "Billain",
    "billain-page project-detail-page document-page overview-page chat-enabled",
  );
  return (
    <>
      <div className="document-layout">
        <aside className="detail-sidebar">
          <Link className="detail-parent" to={"/portfolio"}>
            ← Portfolio
          </Link>
          <nav className="detail-nav" aria-label="프로젝트 메뉴">
            <Link
              to={"/portfolio/billain"}
              className="active"
              aria-current="page"
            >
              <span>01</span>
              Billain
            </Link>
            <Link to={"/portfolio/kata"}>
              <span>02</span>
              kata
            </Link>
          </nav>
        </aside>
        <div className="detail-content">
          <header className="detail-heading">
            <h1>
              Billain
              <span className="period">.</span>
            </h1>
            <p className="case-subtitle">청구 업무 자동화 시스템</p>
            <div className="case-summary">
              <p>
                매월 반복되는 청구 업무를 자동화하기 위해 기획하고 개발한 웹
                애플리케이션입니다.
              </p>
              <p>
                기존 업무 프로세스를 분석하고 AI 기반 바이브코딩을 활용해
                시스템을 구축했으며,
              </p>
              <p>실제 업무에 적용해 운영하고 있습니다.</p>
            </div>
            <dl className="case-facts">
              <div>
                <dt>담당 역할</dt>
                <dd>기획 · 시스템 설계 · AI 활용 개발 · 운영</dd>
              </div>
              <div>
                <dt>프로젝트 성과</dt>
                <dd>업무 처리 시간 3일 이상 → 3~4시간</dd>
              </div>
            </dl>
          </header>
          <Gallery
            slides={[
              {
                src: "assets/billain/01-clients.jpg",
                title: "고객사 관리",
                description:
                  "등록된 고객사를 한눈에 살펴보고, 검색을 통해 작업할 고객사를 찾습니다.",
                alt: "가상 데이터로 구성한 Billain 고객사 관리 화면",
              },
              {
                src: "assets/billain/06-client-detail.jpg",
                title: "고객사 상세",
                description:
                  "선택한 고객사의 기본 정보와 청구 담당자, 결제 방식, 청구 계정을 관리합니다.",
                alt: "가상 데이터로 구성한 Billain 고객사 상세 화면",
              },
              {
                src: "assets/billain/02-lines.jpg",
                title: "회선 리스트",
                description:
                  "통신사 회선 정보를 관리합니다. 등록한 회선 정보는 통신사 청구 데이터를 연결하는 기준이 됩니다.",
                alt: "가상 데이터로 구성한 Billain 회선 리스트 화면",
              },
              {
                src: "assets/billain/03-sources.jpg",
                title: "통신료 취합",
                description:
                  "통신사별 청구 자료를 업로드하고, 회선 정보를 기준으로 요금을 취합합니다. 고객사별 매칭 결과를 확인하고 누락된 내역을 검증합니다.",
                alt: "가상 데이터로 구성한 Billain 통신료 취합 화면",
              },
              {
                src: "assets/billain/05-invoice-sample.jpg",
                title: "청구서 출력",
                description:
                  "확정한 청구 내역을 PDF로 생성하고 이메일로 발송합니다. 고객에게 전달할 이용 내역과 최종 청구 금액을 문서로 정리합니다.",
                alt: "가상 데이터로 구성한 Billain 청구서 출력 화면",
              },
            ]}
            note={
              "공개용 가상 데이터로 재구성한 화면입니다. 청구서 출력 예시는 별도 샘플 서식입니다."
            }
          />
          <section className="case-sections" aria-label="프로젝트 상세">
            <article className="case-article">
              <span className="detail-label">01 / PROBLEM</span>
              <div>
                <h2>반복적인 수작업과 분산된 업무 프로세스</h2>
                <p>
                  통신사별로 제공되는 청구 데이터를 취합하고, 고객사별 청구
                  기준에 맞춰 가공·검증한 뒤 청구서를 발행해야 했습니다.
                </p>
                <p>
                  데이터 취합부터 PDF 생성, 이메일 발송까지 여러 도구와 수작업에
                  의존하면서 매월 3일 이상의 업무 시간이 소요되었습니다.
                </p>
              </div>
            </article>
            <article className="case-article">
              <span className="detail-label">02 / SOLUTION</span>
              <div>
                <h2>분산된 업무를 하나의 시스템으로</h2>
                <p>
                  자료 업로드부터 데이터 취합, 검증, 청구서 발행 및 이메일
                  발송까지의 과정을 하나의 웹 시스템으로 통합했습니다.
                </p>
                <ul className="case-work">
                  <li>
                    <strong>업무 프로세스</strong>
                    기존 청구 절차를 분석하고 통합된 업무 흐름 설계
                  </li>
                  <li>
                    <strong>데이터 관리</strong>
                    고객사·회선·청구 정보의 데이터 구조 및 매칭 규칙 설계
                  </li>
                  <li>
                    <strong>UI/UX</strong>
                    취합 결과와 청구 내역을 확인하고 검증할 수 있는 화면 구현
                  </li>
                  <li>
                    <strong>AI 활용 개발</strong>
                    바이브코딩을 활용한 웹 시스템 구축
                  </li>
                </ul>
              </div>
            </article>
            <article className="case-article">
              <span className="detail-label">03 / IMPACT</span>
              <div>
                <h2>업무 처리 시간 약 90% 단축</h2>
                <table
                  className="case-comparison"
                  aria-label="Billain 도입 전후 비교"
                >
                  <thead>
                    <tr>
                      <th scope="col">Before</th>
                      <th scope="col">After</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>3일 이상</td>
                      <td>3~4시간</td>
                    </tr>
                    <tr>
                      <td>수작업 중심의 데이터 취합</td>
                      <td>시스템 기반 데이터 처리</td>
                    </tr>
                    <tr>
                      <td>여러 도구를 활용한 청구 업무</td>
                      <td>통합된 청구 및 발송 프로세스</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>
            <article className="case-article">
              <span className="detail-label">04 / STORY</span>
              <div>
                <h2>관련 이야기</h2>
                <p>
                  <Link className="text-link" to={"/blog/billain"}>
                    3일 걸리던 업무를 3시간으로 줄이기까지 ↗
                  </Link>
                </p>
                <p>
                  <Link className="text-link" to={"/blog/billain-vibe-coding"}>
                    바이브코딩으로 서비스를 만들어 보았습니다 — Billain ↗
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
