import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { processSteps, sectionCopy } from "@/content";

export function Process() {
  return (
    <section id="process" className="py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow={sectionCopy.process.eyebrow} heading={sectionCopy.process.heading} />
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <li key={step.title} className="rounded-2xl border bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary font-heading font-bold text-primary-foreground">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
