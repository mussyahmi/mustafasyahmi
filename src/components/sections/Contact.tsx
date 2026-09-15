import { Container } from "@/components/Container";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { contact, hero, site } from "@/content";

export function Contact() {
  return (
    <section id="contact" className="pb-16 sm:pb-24">
      <Container>
        <div className="rounded-3xl bg-primary px-6 py-12 text-primary-foreground sm:px-12 sm:py-16">
          <h2 className="max-w-2xl text-3xl font-bold sm:text-5xl">{contact.heading}</h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-primary-foreground/85">{contact.body}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <WhatsAppButton size="lg" message={site.defaultWhatsappMessage} label={hero.primaryCta} />
            <p className="text-primary-foreground/85">
              {contact.emailLabel}{" "}
              <a href={`mailto:${site.email}`} className="font-semibold text-primary-foreground underline underline-offset-4">
                {site.email}
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
