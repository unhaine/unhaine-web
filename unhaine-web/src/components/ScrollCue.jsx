import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

export default function ScrollCue() {
  const ref = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => {
    const cue = ref.current;
    const timers = new Map();
    let frame = 0;
    let disposed = false;
    function update() {
      frame = 0;
      const detail = document.querySelector(".detail-content");
      const scroller =
        detail &&
        detail.scrollHeight > detail.clientHeight + 2 &&
        /auto|scroll/.test(getComputedStyle(detail).overflowY)
          ? detail
          : document.scrollingElement;
      cue.hidden =
        scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop <= 8;
      if (cue.hidden) return;
      const bounds = (
        scroller === detail ? detail : document.querySelector(".site-main")
      ).getBoundingClientRect();
      const bottom = Math.min(
        document.querySelector(".site-footer").getBoundingClientRect().top,
        document.documentElement.clientHeight,
      );
      cue.style.left = `${bounds.left + bounds.width / 2}px`;
      cue.style.top = `${scroller === detail ? bounds.bottom + Math.max(0, (bottom - bounds.bottom - cue.offsetHeight) / 2) : bottom - cue.offsetHeight - 4}px`;
    }
    function schedule() {
      if (!disposed && !frame) frame = requestAnimationFrame(update);
    }
    function onScroll(event) {
      const scroller =
        event.target === document ? document.scrollingElement : event.target;
      if (scroller instanceof Element) {
        clearTimeout(timers.get(scroller));
        scroller.classList.add("is-scrolling");
        timers.set(
          scroller,
          setTimeout(() => {
            scroller.classList.remove("is-scrolling");
            timers.delete(scroller);
          }, 1000),
        );
      }
      schedule();
    }
    const observer = new ResizeObserver(schedule);
    document
      .querySelectorAll(
        ".site-main, .site-footer, .detail-content, .detail-content > *",
      )
      .forEach((element) => observer.observe(element));
    document.addEventListener("scroll", onScroll, {
      capture: true,
      passive: true,
    });
    window.addEventListener("resize", schedule);
    document.addEventListener("load", schedule, true);
    document.fonts.ready.then(schedule);
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("load", schedule, true);
      timers.forEach((timer, element) => {
        clearTimeout(timer);
        element.classList.remove("is-scrolling");
      });
    };
  }, [pathname]);
  return (
    <div ref={ref} className="scroll-cue" hidden aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="m6 9 6 6 6-6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
