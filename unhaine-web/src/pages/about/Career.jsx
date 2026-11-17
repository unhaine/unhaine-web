import { Link } from "react-router";
import usePageMeta from "../../hooks/usePageMeta";

export default function Career() {
  usePageMeta(
    "Career",
    "career-page about-detail-page document-page overview-page chat-enabled",
  );
  return (
    <>
      <div className="document-layout">
        <aside className="detail-sidebar">
          <Link className="detail-parent" to={"/about"}>
            ← About
          </Link>
          <nav className="detail-nav" aria-label="About 하위 페이지">
            <Link to={"/about/career"} className="active" aria-current="page">
              <span>01</span>
              Career
            </Link>
            <Link to={"/about/education"}>
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
              Career
              <span className="period">.</span>
            </h1>
            <p>
              비즈니스 현장에서 고객과 시장을 이해하고, 새로운 사업을 운영하며,
            </p>
            <p>업무의 문제를 해결하는 경험을 쌓아왔습니다.</p>
          </header>
          <section className="detail-list" aria-label="연도별 경력">
            <article className="detail-item">
              <span className="detail-label">2023 — Present</span>
              <div>
                <h2>01. 신사업개발 / 영업</h2>
                <p className="detail-meta">아이알링크 과장</p>
                <p>
                  아웃바운드 TM센터 대상 SaaS 솔루션 영업을 담당했으며, 현재는
                  신규 사업개발 업무를 수행하고 있습니다.
                </p>
                <p>
                  또한 업무 과정에서 발견한 비효율을 개선하기 위해 소프트웨어를
                  직접 기획·개발하며 업무 영역을 확장해 왔습니다.
                </p>
                <h3>주요 업무 및 경험</h3>
                <ul>
                  <li>B2B 솔루션 영업 및 거래처 대응</li>
                  <li>Zoom 기반 협업·커뮤니케이션 솔루션 사업</li>
                  <li>통신료 청구 자동화 시스템 Billain 기획·개발 및 운영</li>
                </ul>
                <h3>관련 이야기</h3>
                <ul className="career-stories">
                  <li>
                    <Link className="text-link" to={"/blog/sales-and-trust"}>
                      고객은 제품을 산 걸까, 사람을 산 걸까? ↗
                    </Link>
                  </li>
                </ul>
              </div>
            </article>
            <article className="detail-item career-gap">
              <span className="detail-label">2021 — 2023</span>
              <div>
                <h2>02. Career Break</h2>
                <p className="detail-meta">2021.03 — 2023.07</p>
                <h3>관련 이야기</h3>
                <ul className="career-stories">
                  <li>
                    <Link className="text-link" to={"/blog/career-break"}>
                      공백의 2년 — 밝혀지지 않은 기록 ↗
                    </Link>
                  </li>
                </ul>
              </div>
            </article>
            <article className="detail-item">
              <span className="detail-label">2015 — 2021</span>
              <div>
                <h2>03. 수출입 / 경영지원</h2>
                <p className="detail-meta">아이알링크 대리</p>
                <p>
                  수출입 및 경영지원 업무를 중심으로 제품의 조달과 공급, 거래처
                  및 협력사 대응, 내부 업무 운영을 경험했습니다.
                </p>
                <p>
                  다양한 실무를 수행하는 과정에서 신규 사업 운영과 업무 프로세스
                  개선에도 참여하며, 기업의 운영 전반을 이해하는 경험을
                  쌓았습니다.
                </p>
                <h3>주요 업무 및 경험</h3>
                <ul>
                  <li>수출입 무역 실무 전반</li>
                  <li>바코드 스캐너 총판 사업 운영</li>
                  <li>정부지원사업 신청 및 관리</li>
                </ul>
              </div>
            </article>
          </section>
        </div>
      </div>
    </>
  );
}
