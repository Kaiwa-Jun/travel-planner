"use client"

import { Navigation } from "@/components/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { PopularSpots } from "@/components/search/popular-spots"

const categories = [
  { id: 1, name: "観光地" },
  { id: 2, name: "グルメ" },
  { id: 3, name: "ショッピング" },
  { id: 4, name: "自然" },
  { id: 5, name: "文化" },
  { id: 6, name: "アクティビティ" },
  { id: 7, name: "温泉" },
  { id: 8, name: "絶景" },
]

export default function SearchPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Search Header */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">スポットを探す</h1>
            <div className="flex gap-4">
              <Input
                placeholder="キーワードで検索..."
                className="max-w-lg"
              />
              <Button>
                <Search className="mr-2 h-4 w-4" />
                検索
              </Button>
            </div>
          </div>

          {/* Search Tabs */}
          <Tabs defaultValue="map">
            <TabsList>
              <TabsTrigger value="map">地図から探す</TabsTrigger>
              <TabsTrigger value="category">カテゴリから探す</TabsTrigger>
            </TabsList>
            
            <TabsContent value="map" className="space-y-4">
              {/* Map Placeholder */}
              <div className="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">地図が表示されます</p>
              </div>
              
              {/* Popular Spots */}
              <PopularSpots className="mt-12" />
            </TabsContent>
            
            <TabsContent value="category" className="space-y-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant="outline"
                    className="h-24 flex flex-col"
                  >
                    <span>{category.name}</span>
                  </Button>
                ))}
              </div>

              {/* Popular Spots */}
              <PopularSpots />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  )
}