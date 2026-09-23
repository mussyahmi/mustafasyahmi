import { ArrowUpRight } from "lucide-react";
import { AppGallery } from "@/components/AppGallery";
import { Container } from "@/components/Container";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Reveal } from "@/components/Reveal";
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
        <div className="mt-14 space-y-16 sm:space-y-24">
          {work.map((item, i) => (
            <Reveal
              as="article"
              key={item.name}
              className="grid items-center gap-8 md:grid-cols-2 md:gap-14"
            >
              <div className={`mx-auto w-full max-w-56 tilt-on-scroll ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <PhoneFrame src={item.image} alt={`${item.name} app screenshot`}>
                  {item.screens && item.screens.length > 0 ? (
                    <AppGallery name={item.name} screens={item.screens} />
                  ) : undefined}
                </PhoneFrame>
              </div>
              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">{item.tagline}</p>
                <h3 className="mt-2 text-3xl font-bold">{item.name}</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">{labels.workProblem} </span>
                  {item.problem}
                </p>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">{labels.workBuilt} </span>
                  {item.built}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
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
                  className="mt-5 inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline"
                >
                  {labels.workOpen} {item.name}
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
