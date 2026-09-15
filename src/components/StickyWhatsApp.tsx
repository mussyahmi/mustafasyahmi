import { WhatsAppButton } from "@/components/WhatsAppButton";
import { hero, site } from "@/content";

export function StickyWhatsApp() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 p-3 backdrop-blur md:hidden">
      <WhatsAppButton className="w-full" size="lg" message={site.defaultWhatsappMessage} label={hero.primaryCta} />
    </div>
  );
}
