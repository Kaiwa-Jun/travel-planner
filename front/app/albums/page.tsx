"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Plus } from "lucide-react"
import { motion } from "framer-motion"

const albums = [
  {
    id: 1,
    title: "東京スカイツリーと浅草散策",
    date: "2024/03/15",
    location: "東京",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    title: "大阪城と道頓堀グルメ",
    date: "2024/04/02",
    location: "大阪",
    image: "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    title: "名古屋城と科学館巡り",
    date: "2024/05/20",
    location: "名古屋",
    image: "https://images.unsplash.com/photo-1615432954382-0608f2d8698c?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    title: "仙台七夕まつり",
    date: "2024/06/10",
    location: "仙台",
    image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    title: "上野動物園と博物館",
    date: "2024/03/28",
    location: "東京",
    image: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 6,
    title: "通天閣と新世界探索",
    date: "2024/05/05",
    location: "大阪",
    image: "https://images.unsplash.com/photo-1589452271712-64b8a66c7b71?w=800&auto=format&fit=crop&q=80"
  }
]

export default function AlbumsPage() {
  // 日付でグループ化
  const albumsByDate = albums.reduce((acc, album) => {
    const month = album.date.substring(0, 7) // YYYY/MM
    if (!acc[month]) {
      acc[month] = []
    }
    acc[month].push(album)
    return acc
  }, {})

  // 場所でグループ化
  const albumsByLocation = albums.reduce((acc, album) => {
    if (!acc[album.location]) {
      acc[album.location] = []
    }
    acc[album.location].push(album)
    return acc
  }, {})

  const AlbumCard = ({ album }) => (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Card>
        <CardContent className="p-4">
          <div 
            className="aspect-video bg-cover bg-center rounded-md mb-4" 
            style={{ backgroundImage: `url(${album.image})` }}
          />
          <h3 className="font-semibold">{album.title}</h3>
          <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {album.date}
            </span>
            <span className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {album.location}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

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
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">アルバム</h1>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新規アルバム
            </Button>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">すべて</TabsTrigger>
              <TabsTrigger value="date">日付</TabsTrigger>
              <TabsTrigger value="location">場所</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="date" className="space-y-8">
              {Object.entries(albumsByDate)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([month, monthAlbums]) => (
                  <div key={month} className="space-y-4">
                    <h2 className="text-xl font-semibold">{month.replace('/', '年')}月</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                      {monthAlbums.map((album) => (
                        <AlbumCard key={album.id} album={album} />
                      ))}
                    </div>
                  </div>
                ))}
            </TabsContent>
            
            <TabsContent value="location" className="space-y-8">
              {Object.entries(albumsByLocation).map(([location, locationAlbums]) => (
                <div key={location} className="space-y-4">
                  <h2 className="text-xl font-semibold">{location}</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {locationAlbums.map((album) => (
                      <AlbumCard key={album.id} album={album} />
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  )
}