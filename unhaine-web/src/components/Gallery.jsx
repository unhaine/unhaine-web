import { useRef, useState } from "react";

export default function Gallery({
  slides,
  className = "project-gallery",
  note,
  children,
}) {
  const [current, setCurrent] = useState(0);
  const dialog = useRef(null);
  const slide = slides[current];
  const move = (delta) =>
    setCurrent((index) => (index + delta + slides.length) % slides.length);
  const controls = slides.length > 1 && (
    <div className="gallery-controls">
      <button
        className="gallery-prev"
        type="button"
        aria-label="이전 화면"
        onClick={() => move(-1)}
      >
        ←
      </button>
      <div className="gallery-dots" aria-label="화면 선택">
        {slides.map((item, index) => (
          <button
            key={item.src}
            type="button"
            aria-label={`${item.title} 보기`}
            aria-pressed={index === current}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
      <button
        className="gallery-next"
        type="button"
        aria-label="다음 화면"
        onClick={() => move(1)}
      >
        →
      </button>
    </div>
  );
  return (
    <figure
      className={className}
      aria-label="프로젝트 화면 미리보기"
      onKeyDown={(event) => {
        if (
          slides.length > 1 &&
          ["ArrowLeft", "ArrowRight"].includes(event.key)
        ) {
          event.preventDefault();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
    >
      <button
        className="gallery-open"
        type="button"
        aria-label="현재 화면 확대 보기"
        aria-haspopup="dialog"
        onClick={() => dialog.current.showModal()}
      >
        <img
          className="gallery-image"
          src={slide.src}
          alt={slide.alt || slide.title}
          width={slide.width || 1440}
          height={slide.height || 900}
          decoding="async"
        />
      </button>
      {children || (
        <figcaption>
          <div className="gallery-details" aria-live="polite">
            <div className="gallery-caption">
              <span className="gallery-title">{slide.title}</span>
              <span className="gallery-count">
                {current + 1} / {slides.length}
              </span>
            </div>
            <p className="gallery-description">{slide.description}</p>
          </div>
          {note && <p className="gallery-note">{note}</p>}
        </figcaption>
      )}
      {controls}
      <dialog
        ref={dialog}
        className="gallery-dialog"
        aria-label="프로젝트 화면 확대 보기"
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="gallery-dialog-header">
          <p className="gallery-dialog-caption">
            {slide.title}
            {slide.description && ` — ${slide.description}`}
          </p>
          <button
            className="gallery-close"
            type="button"
            aria-label="확대 보기 닫기"
            onClick={() => dialog.current.close()}
          >
            닫기 ×
          </button>
        </div>
        <img
          src={slide.src}
          alt={slide.alt || slide.title}
          width={slide.width || 1440}
          height={slide.height || 900}
        />
        {controls}
      </dialog>
    </figure>
  );
}
