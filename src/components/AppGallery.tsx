"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Screen = { src: string; alt: string };

type Props = { name: string; screens: Screen[] };

export function AppGallery({ name, screens }: Props) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const go = (next: number) => setIndex(Math.max(0, Math.min(screens.length - 1, next)));

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={`${name} screens`}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          go(index + 1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          go(index - 1);
        }
      }}
      onTouchStart={(event) => {
        if (event.touches.length !== 1) {
          touchStartX.current = null;
          return;
        }
        touchStartX.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        const start = touchStartX.current;
        if (start === null) return;
        if (event.changedTouches.length !== 1) {
          touchStartX.current = null;
          return;
        }
        const delta = event.changedTouches[0].clientX - start;
        if (Math.abs(delta) > 40) go(delta < 0 ? index + 1 : index - 1);
        touchStartX.current = null;
      }}
      className="rounded-[1.1rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <p className="sr-only" aria-live="polite">
        Screen {index + 1} of {screens.length}
      </p>
      <div className="relative aspect-[390/844] w-full overflow-hidden rounded-[1.1rem]">
        {screens.map((screen, i) => {
          const isNear = Math.abs(i - index) <= 1;
          if (!isNear) return null;
          return (
            <Image
              key={screen.src}
              src={screen.src}
              alt={screen.alt}
              width={390}
              height={844}
              sizes="14rem"
              loading="lazy"
              className={`absolute inset-0 size-full object-cover object-top transition-opacity duration-300 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={i !== index}
            />
          );
        })}
      </div>
      {screens.length > 1 && (
        <div className="flex items-center justify-center gap-2 bg-foreground py-2">
          {screens.map((screen, i) => (
            <button
              key={screen.src}
              type="button"
              onClick={() => go(i)}
              aria-label={`${name} screen ${i + 1} of ${screens.length}`}
              aria-current={i === index}
              className={`rounded-full transition ${
                i === index ? "size-2.5 bg-background" : "size-2 bg-background/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
