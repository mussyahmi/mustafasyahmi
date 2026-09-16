import Image from "next/image";
import { Container } from "@/components/Container";
import { buttonVariants } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { hero, site } from "@/content";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section id="hero" className="pb-16 pt-8 sm:pb-24 sm:pt-16">
      <Container className="grid items-center gap-8 md:grid-cols-[1.15fr_0.85fr] md:gap-14">
        <div className="order-2 md:order-1">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">{hero.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">{hero.headline}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{hero.subheadline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <WhatsAppButton className="hidden md:inline-flex" size="lg" message={site.defaultWhatsappMessage} label={hero.primaryCta} />
            <a
              href="#work"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-13 rounded-full px-7 text-base")}
            >
              {hero.secondaryCta}
            </a>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <Image
            src="/mustafa.webp"
            alt={hero.photoAlt}
            width={800}
            height={800}
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 768px) 40vw, 18rem"
            className="aspect-square w-full max-w-72 rounded-3xl object-cover shadow-xl sm:max-w-sm md:max-w-none"
          />
        </div>
      </Container>
    </section>
  );
}
