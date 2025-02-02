"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="container mx-auto px-6 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        <h1 className="text-4xl md:text-6xl font-bold font-noto-sans-jp">
          あなたの完璧な旅を<br className="hidden sm:block" />プランニング
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
          効率的な旅程作成から思い出の保存まで、旅のすべてをサポート
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button size="lg" asChild>
            <Link href="/search">スポットを探す</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">ログイン</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}