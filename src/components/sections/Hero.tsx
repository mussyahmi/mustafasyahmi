import Image from "next/image";
import { Container } from "@/components/Container";
import { buttonVariants } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { hero, site } from "@/content";
import { cn } from "@/lib/utils";

function Headline() {
  const [before, after] = hero.headline.split(hero.headlineHighlight);
  if (after === undefined) return <>{hero.headline}</>;
  return (
    <>
      {before}
      <span className="text-gradient-ember">{hero.headlineHighlight}</span>
      {after}
    </>
  );
}

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-ink text-ink-foreground">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-70" aria-hidden />
      <div
        className="pointer-events-none absolute -top-24 right-[-10%] h-[36rem] w-[36rem] glow-crimson animate-drift blur-2xl"
        aria-hidden
      />
      <Container className="relative grid items-center gap-8 pb-20 pt-12 sm:pb-28 sm:pt-20 md:grid-cols-[1.15fr_0.85fr] md:gap-14">
        <div className="order-2 md:order-1">
          <p className="hero-item text-sm font-semibold uppercase tracking-[0.14em] text-ink-accent">{hero.eyebrow}</p>
          <h1 className="hero-item mt-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
            <Headline />
          </h1>
          <p className="hero-item mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">{hero.subheadline}</p>
          <div className="hero-item mt-8 flex flex-wrap gap-3">
            <WhatsAppButton
              size="lg"
              message={site.defaultWhatsappMessage}
              label={hero.primaryCta}
              className="hidden md:inline-flex"
            />
            <a
              href="#work"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-13 rounded-full border-ink-border bg-transparent px-7 text-base text-ink-foreground hover:bg-white/10 hover:text-ink-foreground focus-visible:outline-offset-2 focus-visible:[outline:2px_solid_var(--ink-accent)]",
              )}
            >
              {hero.secondaryCta}
            </a>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <div className="relative mx-auto w-full max-w-72 sm:max-w-sm md:max-w-none">
            <div className="pointer-events-none absolute -inset-6 glow-crimson blur-xl" aria-hidden />
            <Image
              src="/mustafa.webp"
              alt={hero.photoAlt}
              width={800}
              height={800}
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 768px) 40vw, 18rem"
              className="relative aspect-square w-full rounded-3xl object-cover shadow-2xl ring-1 ring-white/10 animate-float"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
