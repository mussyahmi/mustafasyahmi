import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { Hero } from "@/components/sections/Hero";
import { Problems } from "@/components/sections/Problems";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Problems />
      </main>
      <StickyWhatsApp />
    </>
  );
}
