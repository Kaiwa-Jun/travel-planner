"use client"

import { motion } from "framer-motion"
import { FadeInSection } from "./fade-in-section"

export function PopularPlansSection() {
  return (
    <section className="bg-muted py-16">
      <div className="container mx-auto px-6">
        <FadeInSection>
          <h2 className="text-3xl font-bold text-center mb-10">人気のプラン</h2>
        </FadeInSection>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <FadeInSection key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-card rounded-lg overflow-hidden h-full"
              >
                <div className="aspect-video bg-muted-foreground/20" />
                <div className="p-4">
                  <h3 className="font-semibold mb-2">東京2日間モデルコース</h3>
                  <p className="text-sm text-muted-foreground">
                    浅草寺から始まり、スカイツリー、渋谷、原宿を巡る定番コース
                  </p>
                </div>
              </motion.div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  )
}