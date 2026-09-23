import { WhatsAppButton } from "@/components/WhatsAppButton";
import { hero, site } from "@/content";

export function StickyWhatsApp() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <WhatsAppButton
        className="pointer-events-auto w-full shadow-[0_12px_30px_-10px_rgba(11,46,23,0.6)] ring-1 ring-black/5"
        size="lg"
        message={site.defaultWhatsappMessage}
        label={hero.primaryCta}
      />
    </div>
  );
}
