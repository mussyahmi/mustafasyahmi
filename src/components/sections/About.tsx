import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/Container";
import { about, site } from "@/content";

export function About() {
  return (
    <section id="about" className="border-y bg-card py-16 sm:py-24">
      <Container className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
        <h2 className="text-3xl font-bold sm:text-4xl">{about.heading}</h2>
        <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline"
          >
            {about.githubLabel}
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </div>
      </Container>
    </section>
  );
}
