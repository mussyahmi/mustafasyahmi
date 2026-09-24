import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { problems, sectionCopy } from "@/content";

export function Problems() {
  return (
    <section id="problems" className="border-y bg-card py-16 sm:py-24">
      <Container>
        <SectionHeading heading={sectionCopy.problems.heading} />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {problems.map((problem, i) => (
            <Reveal
              as="article"
              key={problem.title}
              delayMs={i * 60}
              className="rounded-3xl bg-background p-7 card-soft card-hover"
            >
              <h3 className="text-xl font-bold">{problem.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{problem.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
