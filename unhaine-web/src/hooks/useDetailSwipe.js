import { useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { getSwipeTarget } from "../lib/swipe-navigation";

const INTERACTIVE = "a, button, input, textarea, select, summary, dialog, [role='button'], [contenteditable], .project-gallery, pre, table";

export default function useDetailSwipe(main) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const gesture = useRef(null);
  const cancel = () => { gesture.current = null; };

  return {
    onTouchStart(event) {
      cancel();
      if (
        event.touches.length !== 1 ||
        !window.matchMedia("(max-width: 780px)").matches ||
        document.body.classList.contains("chat-open") ||
        !main.current.querySelector(".detail-nav") ||
        event.target.closest(INTERACTIVE)
      ) return;
      const { clientX: x, clientY: y, identifier } = event.touches[0];
      // Leave browser back/forward edge gestures alone.
      if (x < 24 || x > window.innerWidth - 24) return;
      gesture.current = { x, y, identifier, pathname };
    },
    onTouchMove(event) {
      const start = gesture.current;
      if (!start) return;
      if (event.touches.length !== 1) return cancel();
      const touch = event.touches[0];
      const dx = Math.abs(touch.clientX - start.x);
      const dy = Math.abs(touch.clientY - start.y);
      // Once a vertical scroll begins, do not turn it into page navigation.
      if (dy > 12 && dy >= dx) cancel();
    },
    onTouchEnd(event) {
      const start = gesture.current;
      cancel();
      if (!start || start.pathname !== pathname || window.getSelection()?.toString()) return;
      const end = [...event.changedTouches].find(touch => touch.identifier === start.identifier);
      if (!end) return;
      // Use the displayed tabs as the source of truth for order and destinations.
      const paths = [...main.current.querySelectorAll(".detail-nav a")]
        .map(link => new URL(link.href).hash.slice(1));
      const target = getSwipeTarget(paths, pathname, end.clientX - start.x, end.clientY - start.y);
      if (target) navigate(target);
    },
    onTouchCancel: cancel,
  };
}
