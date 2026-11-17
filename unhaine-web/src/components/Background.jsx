import { useEffect, useRef } from "react";

export default function Background() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const cleanup = [];
    const listenOn = (target, type, handler, options) => {
      target.addEventListener(type, handler, options);
      cleanup.push(() => target.removeEventListener(type, handler, options));
    };
    const listen = (...args) => listenOn(window, ...args);
    const ctx = canvas.getContext("2d");
    if (!ctx) return () => {};
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: 0.7, y: 0.45, active: false };
    let w = 0,
      h = 0,
      dpr = 1,
      raf = 0;
    let visible = !document.hidden;
    const TAU = Math.PI * 2;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint(performance.now() * 0.001);
    }

    // A score with no sound: recurring phrases, slight phase shifts, gentle tension.
    function paint(time) {
      ctx.clearRect(0, 0, w, h);
      const mobile = w < 700;
      const t = motion.matches ? 1.8 : time;
      const centerX = mobile ? w * 0.63 : w * 0.73;
      const centerY = h * 0.48;
      const scale = Math.min(w, h);

      // Diffused color supports the lines without becoming a generic neon glow.
      const halo = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        scale * 0.8,
      );
      halo.addColorStop(0, "rgba(10,128,142,.17)");
      halo.addColorStop(0.45, "rgba(10,84,122,.09)");
      halo.addColorStop(1, "rgba(8,15,28,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      const count = mobile ? 22 : 34;
      const startX = mobile ? -w * 0.22 : w * 0.19;
      const endX = w * 1.17;
      const steps = mobile ? 80 : 125;
      for (let line = 0; line < count; line++) {
        const n = line / (count - 1);
        const spread = (n - 0.5) * (mobile ? h * 0.53 : h * 0.72);
        const phase = n * 6.5;
        const drift = t * 0.34;
        const hover = pointer.active ? (pointer.y - 0.5) * 18 : 0;
        ctx.beginPath();
        for (let k = 0; k <= steps; k++) {
          const u = k / steps;
          const x = startX + (endX - startX) * u;
          const envelope = Math.sin(Math.PI * u) ** 0.9;
          const wave1 =
            Math.sin(u * TAU * 1.45 + phase * 0.52 + drift) * (22 + 24 * n);
          const wave2 =
            Math.sin(u * TAU * 3.1 - phase * 0.3 - drift * 0.7) *
            (8 + 12 * (1 - n));
          const wave3 = Math.cos(u * TAU * 0.65 + n * 4.1 + drift * 0.45) * 35;
          const swell = Math.sin(t * 0.25 + n * TAU * 1.4) * 9;
          const bend = envelope * (wave1 + wave2 + wave3 + swell + hover);
          // Layers converge and open, suggesting a continuously unfinished form.
          const y = centerY + spread + bend + (u - 0.5) * spread * 0.28;
          if (k === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const cyan = line % 5 !== 0;
        const alpha = 0.25 + 0.47 * Math.pow(Math.sin(n * Math.PI), 1.4);
        ctx.strokeStyle = cyan
          ? `rgba(36,218,207,${alpha})`
          : `rgba(88,159,232,${alpha * 0.75})`;
        ctx.lineWidth = line % 7 === 0 ? 2.1 : 1.4;
        ctx.stroke();
      }

      // Three slowly moving accents make the evolution immediately observable.
      for (let j = 0; j < 3; j++) {
        const progress = (t * (0.024 + j * 0.005) + j * 0.34) % 1;
        const x = startX + (endX - startX) * progress;
        const y =
          centerY +
          Math.sin(progress * TAU * 1.45 + j * 1.7 + t * 0.17) * 48 +
          (j - 1) * h * 0.11;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 20);
        glow.addColorStop(0, "rgba(119,255,235,.8)");
        glow.addColorStop(0.18, "rgba(55,232,213,.25)");
        glow.addColorStop(1, "rgba(55,232,213,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, TAU);
        ctx.fill();
        ctx.fillStyle = "rgba(172,255,243,.75)";
        ctx.beginPath();
        ctx.arc(x, y, 1.9, 0, TAU);
        ctx.fill();
      }
    }

    function tick(ms) {
      raf = 0;
      if (!visible) return;
      paint(ms * 0.001);
      if (!motion.matches) raf = requestAnimationFrame(tick);
    }
    function start() {
      if (!raf && visible && !motion.matches) raf = requestAnimationFrame(tick);
    }
    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }
    listen(
      "resize",
      () => {
        resize();
        start();
      },
      { passive: true },
    );
    listen(
      "pointermove",
      (e) => {
        pointer.x = e.clientX / w;
        pointer.y = e.clientY / h;
        pointer.active = true;
      },
      { passive: true },
    );
    listen("pointerleave", () => (pointer.active = false), {
      passive: true,
    });
    listenOn(document, "visibilitychange", () => {
      visible = !document.hidden;
      visible ? start() : stop();
    });
    if (motion.addEventListener)
      listenOn(motion, "change", () => {
        stop();
        paint(performance.now() * 0.001);
        start();
      });
    resize();
    start();

    return () => {
      stop();
      cleanup.forEach((remove) => remove());
    };
  }, []);
  return (
    <div className="site-background" aria-hidden="true">
      <canvas ref={ref} />
      <div className="ambient" />
      <div className="grain" />
    </div>
  );
}
