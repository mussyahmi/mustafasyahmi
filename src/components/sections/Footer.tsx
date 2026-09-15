import { Container } from "@/components/Container";
import { site } from "@/content";

export function Footer() {
  return (
    <footer className="border-t pb-28 pt-8 md:pb-8">
      <Container className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>© 2026 {site.name}</p>
        <p>
          {site.whatsappDisplay} · {site.email}
        </p>
      </Container>
    </footer>
  );
}
