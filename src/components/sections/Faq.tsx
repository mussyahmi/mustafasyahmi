import { Plus } from "lucide-react";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { faqs, sectionCopy } from "@/content";

export function Faq() {
  return (
    <section id="faq" className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow={sectionCopy.faq.eyebrow} heading={sectionCopy.faq.heading} />
        <div className="mt-8 divide-y border-y">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {faq.question}
                <Plus className="size-5 shrink-0 text-primary transition group-open:rotate-45" aria-hidden />
              </summary>
              <div className="faq-body">
                <p className="mt-3 leading-relaxed text-muted-foreground">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
