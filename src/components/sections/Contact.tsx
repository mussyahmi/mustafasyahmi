import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { contact, hero, site } from "@/content";

export function Contact() {
  return (
    <section id="contact" className="pb-16 sm:pb-24">
      <Container>
        <Reveal className="relative overflow-hidden rounded-3xl bg-ink px-6 py-12 text-ink-foreground sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 dot-grid opacity-60" aria-hidden />
          <div
            className="pointer-events-none absolute -bottom-40 left-[-10%] h-[28rem] w-[28rem] glow-crimson blur-2xl"
            aria-hidden
          />
          <div className="relative">
            <h2 className="max-w-2xl text-3xl font-bold sm:text-5xl">{contact.heading}</h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-muted">{contact.body}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <WhatsAppButton size="lg" message={site.defaultWhatsappMessage} label={hero.primaryCta} />
              <p className="text-ink-muted">
                {contact.emailLabel}{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="inline-block py-2 font-semibold text-ink-foreground underline underline-offset-4"
                >
                  {site.email}
                </a>
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
