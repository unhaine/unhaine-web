import { useLayoutEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Chat from "../components/Chat";
import Background from "../components/Background";
import ScrollCue from "../components/ScrollCue";

export default function SiteLayout() {
  const { pathname } = useLocation();
  const main = useRef(null);
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    main.current.querySelector(".detail-content")?.scrollTo(0, 0);
    main.current.focus({ preventScroll: true });
  }, [pathname]);
  return (
    <>
      <Background />
      <Header key={pathname} />
      <main ref={main} className="site-main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <Chat />
      <ScrollCue />
    </>
  );
}
