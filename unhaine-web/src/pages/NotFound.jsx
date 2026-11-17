import { Link } from "react-router";
import usePageMeta from "../hooks/usePageMeta";

export default function NotFound() {
  usePageMeta("페이지를 찾을 수 없습니다", "overview-page chat-enabled");
  return (
    <div className="page-heading">
      <span className="eyebrow">404</span>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <p className="lead">주소를 확인하거나 메인으로 이동해 주세요.</p>
      <Link className="btn primary" to="/">
        메인으로 ↗
      </Link>
    </div>
  );
}
