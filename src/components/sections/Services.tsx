import { Check } from "lucide-react";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { sectionCopy, services } from "@/content";
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
          {services.map((service) => (
            <article
              key={service.id}
              className={cn(
                "flex flex-col rounded-2xl border bg-card p-6 sm:p-8",
                service.featured && "border-primary ring-1 ring-primary",
              )}
            >
              {service.badge && (
                <p className="mb-3 w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  {service.badge}
                </p>
              )}
              <h3 className="text-xl font-bold">{service.name}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{service.summary}</p>
              <p className="mt-6 text-sm text-muted-foreground">From</p>
              <p className="font-heading text-4xl font-extrabold text-primary">
                {service.price}
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
                <WhatsAppButton className="w-full" message={service.whatsappMessage} label="Ask about this" />
              </div>
            </article>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm text-muted-foreground">{sectionCopy.services.note}</p>
      </Container>
    </section>
  );
}
