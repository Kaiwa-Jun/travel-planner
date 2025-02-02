"use client"

import { Sun, Briefcase, Album } from "lucide-react"
import { FadeInSection } from "./fade-in-section"

const useCases = [
  {
    icon: Sun,
    title: "週末の日帰り旅行",
    features: [
      "近場のスポットを効率的に周遊",
      "時間を最大限活用できるルート設計",
      "グルメスポットも含めた最適プラン",
    ],
    image: "https://images.unsplash.com/photo-1533923156502-be31530547c4?w=800&auto=format&fit=crop&q=80",
  },
  {
    icon: Briefcase,
    title: "長期休暇の旅行",
    features: [
      "複数日程の効率的な周遊プラン",
      "宿泊地を考慮したルート設計",
      "柔軟な予定変更にも対応",
    ],
    image: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&auto=format&fit=crop&q=80",
  },
  {
    icon: Album,
    title: "思い出作り",
    features: [
      "写真を自動で整理",
      "位置情報と連携した記録",
      "SNSシェア用アルバム作成",
    ],
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&auto=format&fit=crop&q=80",
  },
]

export function UseCasesSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <FadeInSection>
          <div className="text-center max-w-[800px] mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">こんな時に便利です</h2>
            <p className="text-lg text-muted-foreground">
              あなたの旅のスタイルに合わせて、最適なサポートを提供します
            </p>
          </div>
        </FadeInSection>
        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <FadeInSection key={useCase.title} delay={index * 0.1}>
              <div className="bg-card rounded-lg overflow-hidden h-full">
                <div 
                  className="aspect-[16/9] bg-cover bg-center" 
                  style={{ backgroundImage: `url(${useCase.image})` }}
                />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <useCase.icon className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-semibold">{useCase.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {useCase.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  )
}