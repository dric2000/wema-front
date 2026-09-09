import { Faq } from "@/components/sections/faq";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Problem } from "@/components/sections/problem";

export default function Home() {
  return (
    <>
      <Hero />
      {/* <MarketsBar /> */}
      <Problem />
      <HowItWorks />
      <Faq />
      <Footer />
    </>
  );
}
