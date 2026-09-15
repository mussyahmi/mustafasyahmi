import { services, site } from "@/content";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${site.name}, Web Developer`,
    url: site.url,
    image: `${site.url}/og.jpg`,
    email: site.email,
    telephone: `+${site.whatsappNumber}`,
    areaServed: { "@type": "Country", name: "Malaysia" },
    founder: { "@type": "Person", name: site.name, jobTitle: "Software Engineer", sameAs: [site.github] },
    makesOffer: services.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service.name },
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: Number(service.price.replace(/[^0-9]/g, "")),
        priceCurrency: "MYR",
      },
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
