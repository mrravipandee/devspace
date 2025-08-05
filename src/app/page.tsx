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

      <Footer />

    </div>
  );
}