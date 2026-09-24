"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Screen = { src: string; alt: string };

type Props = { name: string; screens: Screen[] };

const HOLD_MS = 3500;

export function AppGallery({ name, screens }: Props) {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (screens.length < 2) return;
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      timer ??= setInterval(() => setIndex((i) => (i + 1) % screens.length), HOLD_MS);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
    };

    if (typeof IntersectionObserver === "undefined") {
      start();
      return stop;
    }

    // Only cycle while the frame is actually on screen, so it costs nothing
    // while someone is reading another section.
    const observer = new IntersectionObserver(
      (entries) => (entries.some((entry) => entry.isIntersecting) ? start() : stop()),
      { threshold: 0.3 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      stop();
    };
  }, [screens.length]);

  return (
    <div ref={ref} className="relative aspect-[390/844] w-full overflow-hidden rounded-[1.1rem] sm:aspect-[390/844]">
      {screens.map((screen, i) => {
        // Only the current screen and its neighbour stay mounted, so the rest
        // are never fetched.
        if (Math.abs(i - index) > 1 && !(index === screens.length - 1 && i === 0)) return null;
        return (
          <Image
            key={screen.src}
            src={screen.src}
            alt={i === 0 ? `${name} app screenshot` : screen.alt}
            width={390}
            height={844}
            sizes="16rem"
            loading="lazy"
            className={`absolute inset-0 size-full object-cover object-top transition-opacity duration-700 ease-out-soft ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          />
        );
      })}
    </div>
  );
}
