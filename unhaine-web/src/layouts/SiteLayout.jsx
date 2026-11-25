import { useLayoutEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Chat from "../components/Chat";
import Background from "../components/Background";
import ScrollCue from "../components/ScrollCue";
import useDetailSwipe from "../hooks/useDetailSwipe";

export default function SiteLayout() {
  const { pathname } = useLocation();
  const main = useRef(null);
  const swipeHandlers = useDetailSwipe(main);
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    main.current.querySelector(".detail-content")?.scrollTo(0, 0);
    main.current.focus({ preventScroll: true });
  }, [pathname]);
  return (
    <>
      <Background />
      <Header key={pathname} />
      <main ref={main} className="site-main" tabIndex={-1} {...swipeHandlers}>
        <Outlet />
      </main>
      <Footer />
      <Chat />
      <ScrollCue />
    </>
  );
}
