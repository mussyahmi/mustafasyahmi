import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { processSteps, sectionCopy } from "@/content";

export function Process() {
  return (
    <section id="process" className="py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow={sectionCopy.process.eyebrow} heading={sectionCopy.process.heading} />
        <ol className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <span
            className="pointer-events-none absolute left-5 top-5 hidden h-px w-[calc(100%-2.5rem)] bg-gradient-to-r from-primary/60 to-primary/10 lg:block"
            aria-hidden
          />
          {processSteps.map((step, i) => (
            <Reveal as="li" key={step.title} delayMs={i * 80} className="relative">
              <span className="relative z-10 flex size-10 items-center justify-center rounded-full bg-primary font-heading font-bold text-primary-foreground shadow-[0_8px_20px_-8px_rgba(158,27,36,0.8)]">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
