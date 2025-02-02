"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Star } from "lucide-react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export const popularSpots = [
  {
    id: 1,
    name: "東京スカイツリー",
    location: "東京都墨田区",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=80",
    description: "高さ634mを誇る世界一高い電波塔。展望台からは東京の絶景が楽しめます。"
  },
  {
    id: 2,
    name: "浅草寺",
    location: "東京都台東区",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1570459027562-4a916cc6113f?w=800&auto=format&fit=crop&q=80",
    description: "東京都内最古の寺院。雷門と仲見世通りで有名な観光名所です。"
  },
  {
    id: 3,
    name: "大阪城",
    location: "大阪府大阪市",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&auto=format&fit=crop&q=80",
    description: "豊臣秀吉が築城した日本を代表する城。天守閣からの眺めは圧巻です。"
  },
  {
    id: 4,
    name: "金閣寺",
    location: "京都府京都市",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1624253321171-1be53e12f5f4?w=800&auto=format&fit=crop&q=80",
    description: "金箔に覆われた三層の建物が印象的な世界遺産。美しい庭園でも有名です。"
  },
  {
    id: 5,
    name: "宮島・厳島神社",
    location: "広島県廿日市市",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&auto=format&fit=crop&q=80",
    description: "海上に浮かぶ朱色の大鳥居が象徴的な神社。日本三景の一つです。"
  },
  {
    id: 6,
    name: "富士山",
    location: "山梨県・静岡県",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1578637387939-43c525550085?w=800&auto=format&fit=crop&q=80",
    description: "日本の象徴である世界遺産。四季折々の美しい姿を見せてくれます。"
  }
]

interface PopularSpotsProps {
  className?: string
}

export function PopularSpots({ className = "" }: PopularSpotsProps) {
  return (
    <div className={className}>
      <h2 className="text-2xl font-semibold mb-6">人気のスポット</h2>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="pb-12"
      >
        {popularSpots.map((spot) => (
          <SwiperSlide key={spot.id}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card className="h-full">
                <CardContent className="p-4">
                  <div 
                    className="aspect-video bg-cover bg-center rounded-md mb-4" 
                    style={{ backgroundImage: `url(${spot.image})` }}
                  />
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold">{spot.name}</h3>
                      <div className="flex items-center text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 text-sm">{spot.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      {spot.location}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {spot.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}