import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Problems } from "@/components/sections/Problems";
import { Process } from "@/components/sections/Process";
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
        <Process />
        <About />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <StickyWhatsApp />
    </>
  );
}
