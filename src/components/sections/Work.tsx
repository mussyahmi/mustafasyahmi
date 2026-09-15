import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/Container";
import { PhoneFrame } from "@/components/PhoneFrame";
import { SectionHeading } from "@/components/SectionHeading";
import { labels, sectionCopy, work } from "@/content";

export function Work() {
  return (
    <section id="work" className="border-y bg-card py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={sectionCopy.work.eyebrow}
          heading={sectionCopy.work.heading}
          intro={sectionCopy.work.intro}
        />
        <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-x-10 md:gap-y-16">
          {work.map((item) => (
            <article key={item.name} className="grid grid-cols-[7.5rem_1fr] items-start gap-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <PhoneFrame src={item.image} alt={`${item.name} app screenshot`} />
              <div>
                <p className="text-sm font-semibold text-primary">{item.tagline}</p>
                <h3 className="mt-1 text-2xl font-bold">{item.name}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">{labels.workProblem}{" "}</span>
                  {item.problem}
                </p>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">{labels.workBuilt}{" "}</span>
                  {item.built}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {item.stack.map((tech) => (
                    <li key={tech} className="rounded-full border bg-background px-3 py-1 text-xs font-medium">
                      {tech}
                    </li>
                  ))}
                </ul>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline"
                >
                  {labels.workOpen} {item.name}
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
