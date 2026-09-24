import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { about, site } from "@/content";

export function About() {
  return (
    <section id="about" className="border-y bg-card py-16 sm:py-24">
      <Container>
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">{about.heading}</h2>
        <Reveal delayMs={80} className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-muted-foreground">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline"
          >
            {about.githubLabel}
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
