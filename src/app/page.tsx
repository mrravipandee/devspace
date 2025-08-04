'use client';
import { Navbar, Hero, Features, DevCard, OpenSource, Testimonials, Footer } from "@/components/LandingPage";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <Hero />

      <Features />

      <DevCard />

      <OpenSource />

      <Testimonials />

      <section className="my-96">
        <h2 className="text-center font-bold logo text-primary/80 text-[5rem]">Dev</h2>
        <h3 className="text-center logo text-primaryText text-[4rem] mt-[-40px]">Space</h3>
      </section>

      <Footer />

    </div>
  );
}