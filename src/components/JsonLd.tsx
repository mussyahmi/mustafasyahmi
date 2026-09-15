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
    address: { "@type": "PostalAddress", addressCountry: "MY" },
    areaServed: { "@type": "Country", name: "Malaysia" },
    founder: { "@type": "Person", name: site.name, jobTitle: "Software Engineer", sameAs: [site.github] },
    makesOffer: services.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service.name },
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: Number(service.price.replace(/[^0-9]/g, "")),
        priceCurrency: "MYR",
        ...(service.unit === "/month" ? { unitText: "MONTH" } : {}),
      },
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
