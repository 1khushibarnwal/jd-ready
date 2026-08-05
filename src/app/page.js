import { auth } from "@/auth";

import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Comparison from "@/components/landing/Comparison";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default async function Home() {
  const session = await auth();

  return (
    <div className="bg-background">
      <Header session={session} />

      <Hero session={session} />

      <Features />

      <HowItWorks />

      <Comparison />

      <FAQ />

      <CTA session={session} />

      <Footer session={session} />
    </div>
  );
}
