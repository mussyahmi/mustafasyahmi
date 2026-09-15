import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { Hero } from "@/components/sections/Hero";
import { Problems } from "@/components/sections/Problems";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Problems />
        <Services />
        <Work />
      </main>
      <StickyWhatsApp />
    </>
  );
}
