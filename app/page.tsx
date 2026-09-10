import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Nav } from "@/components/Nav";
import { Refusal } from "@/components/Refusal";
import { Waitlist } from "@/components/Waitlist";
import { WhoItsFor } from "@/components/WhoItsFor";

export default function Page() {
  return (
    <>
      <span id="top" />
      <Nav />
      <main id="main">
        <Hero />
        <Refusal />
        <HowItWorks />
        <WhoItsFor />
        <Faq />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
