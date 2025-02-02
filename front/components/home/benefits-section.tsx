"use client"

import { Clock, Route, Camera, Share2, Star, Sparkles } from "lucide-react"
import { FadeInSection } from "./fade-in-section"

const benefits = [
  {
    icon: Clock,
    title: "時間を効率的に",
    description: "最適なルート提案で移動時間を最小限に。より多くの観光スポットを効率よく巡ることができます。",
  },
  {
    icon: Route,
    title: "迷わない旅行計画",
    description: "地図ベースの直感的なプランニングで、移動経路や所要時間が一目瞭然。初めての場所でも安心です。",
  },
  {
    icon: Camera,
    title: "思い出をカタチに",
    description: "写真と位置情報を連携し、旅の記録を自動で整理。後から見返すのも簡単です。",
  },
  {
    icon: Share2,
    title: "みんなでシェア",
    description: "作成したプランを共有して、友達や家族と一緒に旅行を計画できます。",
  },
  {
    icon: Star,
    title: "おすすめスポット",
    description: "人気スポットや穴場情報をAIが提案。新しい発見のある旅行を実現します。",
  },
  {
    icon: Sparkles,
    title: "カスタマイズ自由",
    description: "予算や時間に合わせて柔軟にプランを調整。あなたにぴったりの旅行プランを作成できます。",
  },
]

export function BenefitsSection() {
  return (
    <section className="bg-muted py-16">
      <div className="container mx-auto px-6">
        <FadeInSection>
          <div className="text-center max-w-[800px] mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">旅行がもっと楽しくなる</h2>
            <p className="text-lg text-muted-foreground">
              Travel Plannerを使えば、旅行の計画から思い出作りまで、すべてがスムーズに。
              あなたの旅をより良いものにする機能が満載です。
            </p>
          </div>
        </FadeInSection>
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <FadeInSection key={benefit.title} delay={index * 0.1}>
              <div className="bg-card p-6 rounded-lg h-full">
                <benefit.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  )
}