"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { FadeInSection } from "./fade-in-section"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-10" />
      <div className="container mx-auto relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <FadeInSection>
            <div className="max-w-[600px] space-y-8">
              <h2 className="text-3xl font-bold">
                あなたの旅を、もっと素敵に
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground">
                Travel Plannerで旅行計画を始めましょう。<br />
                無料で簡単に、あなただけの思い出に残る旅行プランを作成できます。
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <Link href="/create">
                    プランを作成する
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                  <Link href="/search">
                    スポットを探す
                  </Link>
                </Button>
              </div>
            </div>
          </FadeInSection>

          {/* Device Frames */}
          <FadeInSection delay={0.2}>
            <div className="relative">
              {/* Desktop Frame */}
              <div className="hidden md:block relative bg-background rounded-lg shadow-xl p-4 mx-auto max-w-[600px]">
                <div className="flex items-center justify-start gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="aspect-[16/10] bg-muted rounded-md overflow-hidden">
                  {/* Desktop Screenshot Placeholder */}
                  <div className="w-full h-full bg-muted-foreground/10" />
                </div>
              </div>

              {/* Mobile Frame */}
              <div className="md:absolute md:bottom-0 md:-right-8 bg-background rounded-[2rem] shadow-xl p-3 w-[280px] mx-auto">
                <div className="w-full rounded-[1.5rem] overflow-hidden">
                  <div className="w-full h-12 bg-muted flex items-center justify-center">
                    <div className="w-20 h-6 rounded-full bg-muted-foreground/10" />
                  </div>
                  <div className="aspect-[9/16] bg-muted">
                    {/* Mobile Screenshot Placeholder */}
                    <div className="w-full h-full bg-muted-foreground/10" />
                  </div>
                  <div className="w-full h-12 bg-muted flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-muted-foreground/10" />
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  )
}