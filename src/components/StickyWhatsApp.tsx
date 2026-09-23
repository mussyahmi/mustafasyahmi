"use client";

import { useEffect, useState } from "react";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { hero, site } from "@/content";
import { cn } from "@/lib/utils";

export function StickyWhatsApp() {
  // Visible by default, so a no-script visit still gets the button.
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const heroSection = document.getElementById("hero");
    if (!heroSection || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setHidden(entry.isIntersecting);
      },
      { threshold: 0.35 },
    );
    observer.observe(heroSection);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 p-3 backdrop-blur transition-transform duration-300 ease-out-soft md:hidden",
        hidden && "translate-y-full",
      )}
    >
      <WhatsAppButton className="w-full" size="lg" message={site.defaultWhatsappMessage} label={hero.primaryCta} />
    </div>
  );
}
