"use client"

import { motion } from "framer-motion"
import { Search, PlusCircle, Image, ArrowRight } from "lucide-react"
import { FadeInSection } from "./fade-in-section"

const features = [
  {
    icon: Search,
    title: "スポット検索",
    description: "日本全国の観光スポットを簡単に検索",
  },
  {
    icon: PlusCircle,
    title: "プラン作成",
    description: "効率的な旅行プランを作成",
  },
  {
    icon: Image,
    title: "思い出を保存",
    description: "旅の思い出をアルバムで管理",
  },
]

export function FeaturesSection() {
  return (
    <section className="container mx-auto px-6 py-16">
      <FadeInSection>
        <div className="text-center max-w-[800px] mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">簡単3ステップで旅行計画</h2>
          <p className="text-lg text-muted-foreground">
            Travel Plannerなら、旅行の計画から思い出作りまでをシンプルな3ステップで実現できます
          </p>
        </div>
      </FadeInSection>
      <FadeInSection>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
          {features.map((feature, index) => (
            <div key={feature.title} className="flex-1 relative">
              <div className="bg-card rounded-lg p-6 h-full flex flex-col items-center text-center relative z-10">
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
              {index < features.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                  <ArrowRight className="h-8 w-8 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </FadeInSection>
    </section>
  )
}