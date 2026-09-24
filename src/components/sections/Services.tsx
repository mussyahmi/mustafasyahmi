import { Check } from "lucide-react";
import { Container } from "@/components/Container";
import { CountUp } from "@/components/CountUp";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { labels, sectionCopy, services } from "@/content";
import { parseRinggit } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Services() {
  return (
    <section id="services" className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={sectionCopy.services.eyebrow}
          heading={sectionCopy.services.heading}
          intro={sectionCopy.services.intro}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {services.map((service, i) => (
            <Reveal
              as="article"
              key={service.id}
              delayMs={i * 60}
              className={cn(
                "flex flex-col rounded-3xl bg-card p-7 sm:p-9",
                service.featured
                  ? "edge-crimson shadow-[0_24px_60px_-28px_rgba(158,27,36,0.65)]"
                  : "border border-border",
              )}
            >
              <div className="mb-3 flex h-6 items-center">
                {service.badge && (
                  <p className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    {service.badge}
                  </p>
                )}
              </div>
              <h3 className="text-xl font-bold">{service.name}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground sm:min-h-[3.25rem]">{service.summary}</p>
              <p className="mt-6 text-sm text-muted-foreground">{labels.priceFrom}</p>
              <p className="font-heading text-4xl font-extrabold text-primary">
                <CountUp value={parseRinggit(service.price)} />
                {service.unit && <span className="text-base font-semibold text-muted-foreground">{service.unit}</span>}
              </p>
              <ul className="mt-6 space-y-2">
                {service.includes.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <WhatsAppButton className="w-full" message={service.whatsappMessage} label={labels.serviceCta} />
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm text-muted-foreground">{sectionCopy.services.note}</p>
      </Container>
    </section>
  );
}
