import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { problems, sectionCopy } from "@/content";

export function Problems() {
  return (
    <section id="problems" className="border-y bg-card py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow={sectionCopy.problems.eyebrow} heading={sectionCopy.problems.heading} />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {problems.map((problem, i) => (
            <Reveal
              as="article"
              key={problem.title}
              delayMs={i * 60}
              className="rounded-2xl bg-background p-6 card-soft card-hover"
            >
              <span className="font-heading text-sm font-bold text-primary">0{i + 1}</span>
              <h3 className="mt-3 text-xl font-bold">{problem.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{problem.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
