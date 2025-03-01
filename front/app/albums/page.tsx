"use client";

import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Plus } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { type SavedPlan } from "@/types/schedule";
import { useRouter } from "next/navigation";

const PLANS_STORAGE_KEY = "savedPlans";
const PHOTOS_STORAGE_KEY = "planPhotos";

export default function AlbumsPage() {
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const router = useRouter();

  // 初期データの読み込み
  useEffect(() => {
    const savedPlans = localStorage.getItem(PLANS_STORAGE_KEY);
    if (savedPlans) {
      const parsedPlans = JSON.parse(savedPlans);
      setPlans(parsedPlans);
    }
  }, []);

  // 写真付きのプランのみをフィルタリング
  const albumPlans = useMemo(() => {
    return plans.filter((plan) => {
      const savedPhotos = localStorage.getItem(PHOTOS_STORAGE_KEY);
      if (savedPhotos) {
        const photos = JSON.parse(savedPhotos);
        return photos[plan.id]?.length > 0;
      }
      return false;
    });
  }, [plans]);

  // 日付でグループ化
  const albumsByDate = useMemo(() => {
    return albumPlans.reduce((acc, plan) => {
      const month = format(new Date(plan.startDate), "yyyy年MM月", {
        locale: ja,
      });
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(plan);
      return acc;
    }, {} as Record<string, SavedPlan[]>);
  }, [albumPlans]);

  // 場所でグループ化
  const albumsByLocation = useMemo(() => {
    return albumPlans.reduce((acc, plan) => {
      if (!acc[plan.location]) {
        acc[plan.location] = [];
      }
      acc[plan.location].push(plan);
      return acc;
    }, {} as Record<string, SavedPlan[]>);
  }, [albumPlans]);

  const AlbumCard = ({ plan }: { plan: SavedPlan }) => {
    const [thumbnailUrl, setThumbnailUrl] = useState<string>(plan.image);

    // サムネイル画像の読み込み
    useEffect(() => {
      const loadThumbnail = () => {
        const savedPhotos = localStorage.getItem(PHOTOS_STORAGE_KEY);
        if (savedPhotos) {
          const photos = JSON.parse(savedPhotos);
          if (photos[plan.id]?.length > 0) {
            setThumbnailUrl(photos[plan.id][0].url);
          }
        }
      };
      loadThumbnail();
    }, [plan.id]);

    const formatDateRange = (startDate: string, endDate: string) => {
      const start = format(new Date(startDate), "M/d(E)", { locale: ja });
      const end = format(new Date(endDate), "M/d(E)", { locale: ja });
      return `${start} 〜 ${end}`;
    };

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="group cursor-pointer"
        onClick={() => router.push(`/albums/${plan.id}`)}
      >
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div
              className="aspect-video bg-cover bg-center rounded-md mb-4 group-hover:opacity-90 transition-opacity"
              style={{ backgroundImage: `url(${thumbnailUrl})` }}
            />
            <h3 className="font-semibold group-hover:text-primary transition-colors">
              {plan.title}
            </h3>
            <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDateRange(plan.startDate, plan.endDate)}
              </span>
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {plan.location}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

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
            <Link href="/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                新規プラン作成
              </Button>
            </Link>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">すべて</TabsTrigger>
              <TabsTrigger value="date">日付</TabsTrigger>
              <TabsTrigger value="location">場所</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {albumPlans.map((plan) => (
                  <AlbumCard key={plan.id} plan={plan} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="date" className="space-y-8">
              {Object.entries(albumsByDate)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([month, monthPlans]) => (
                  <div key={month} className="space-y-4">
                    <h2 className="text-xl font-semibold">{month}</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                      {monthPlans.map((plan) => (
                        <AlbumCard key={plan.id} plan={plan} />
                      ))}
                    </div>
                  </div>
                ))}
            </TabsContent>

            <TabsContent value="location" className="space-y-8">
              {Object.entries(albumsByLocation)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([location, locationPlans]) => (
                  <div key={location} className="space-y-4">
                    <h2 className="text-xl font-semibold">{location}</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                      {locationPlans.map((plan) => (
                        <AlbumCard key={plan.id} plan={plan} />
                      ))}
                    </div>
                  </div>
                ))}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
