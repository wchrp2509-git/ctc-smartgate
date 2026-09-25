"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Slide = {
  src: string;
  alt: string;
};

const AUTO_ADVANCE_MS = 5000;

export default function ImageSlideshow({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (i: number) => {
      setIndex(((i % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-md"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[16/9] w-full bg-white">
        {slides.map((slide, i) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 1024px, 100vw"
            className={`object-contain transition-opacity duration-700 ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <button
        type="button"
        aria-label="ภาพก่อนหน้า"
        onClick={() => goTo(index - 1)}
        className="absolute top-1/2 left-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-brand-dark shadow-md transition-colors hover:bg-white"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="ภาพถัดไป"
        onClick={() => goTo(index + 1)}
        className="absolute top-1/2 right-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-brand-dark shadow-md transition-colors hover:bg-white"
      >
        ›
      </button>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`ไปที่ภาพที่ ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-2.5 rounded-full transition-all ${
              i === index ? "w-6 bg-brand" : "w-2.5 bg-brand/30 hover:bg-brand/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
