"use client";

import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { BenefitsSection } from "@/components/home/benefits-section";
import { UseCasesSection } from "@/components/home/use-cases-section";
import { CTASection } from "@/components/home/cta-section";
import { PopularPlansSection } from "@/components/home/popular-plans-section";

export function HomeContent() {
  return (
    <main className="pt-24 md:pt-32">
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <UseCasesSection />
      <CTASection />
      <PopularPlansSection />
    </main>
  );
}
