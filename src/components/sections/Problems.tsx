import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { problems, sectionCopy } from "@/content";

export function Problems() {
  return (
    <section id="problems" className="border-y bg-card py-16 sm:py-24">
      <Container>
        <SectionHeading heading={sectionCopy.problems.heading} />
        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {problems.map((problem, i) => (
            <Reveal
              as="article"
              key={problem.title}
              delayMs={i * 60}
              className="border-t-2 border-primary/30 pt-5"
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
