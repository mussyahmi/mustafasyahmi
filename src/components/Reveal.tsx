"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode, type Ref } from "react";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delayMs?: number;
};

export function Reveal({ children, as: Tag = "div", className, delayMs = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (revealed) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [revealed]);

  return (
    <Tag
      ref={ref as Ref<never>}
      data-reveal
      data-revealed={revealed ? "true" : "false"}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
