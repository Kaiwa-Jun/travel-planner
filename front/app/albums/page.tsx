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
  const [sortBy, setSortBy] = useState<"all" | "date" | "location">("all");

  // ソート用のボタンスタイル
  const getSortButtonStyle = (isActive: boolean) => {
    return `px-4 py-2 text-sm rounded-full transition-colors ${
      isActive
        ? "bg-primary text-primary-foreground"
        : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
    }`;
  };

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

  // フィルター適用後のプラン（写真付きのプランのみ）
  const filteredAndSortedPlans = useMemo(() => {
    let result = [...albumPlans];

    // ソートの適用
    switch (sortBy) {
      case "all":
        // IDでソート（作成順）
        result.sort((a, b) => (a.id > b.id ? 1 : -1));
        break;
      case "date":
        result.sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
        break;
      case "location":
        result.sort((a, b) => a.location.localeCompare(b.location));
        break;
    }

    return result;
  }, [albumPlans, sortBy]);

  // プランをグループ化
  const groupedPlans = useMemo(() => {
    const result = new Map<string, SavedPlan[]>();

    if (sortBy === "all") {
      // 全てのプランを1つのグループにまとめる
      result.set("すべてのアルバム", filteredAndSortedPlans);
    } else if (sortBy === "date") {
      // 年月でグループ化（降順）
      filteredAndSortedPlans.forEach((plan) => {
        const yearMonth = format(new Date(plan.startDate), "yyyy年MM月", {
          locale: ja,
        });
        if (!result.has(yearMonth)) {
          result.set(yearMonth, []);
        }
        result.get(yearMonth)?.push(plan);
      });
    } else {
      // 場所でグループ化
      filteredAndSortedPlans.forEach((plan) => {
        if (!result.has(plan.location)) {
          result.set(plan.location, []);
        }
        result.get(plan.location)?.push(plan);
      });
    }

    return result;
  }, [filteredAndSortedPlans, sortBy]);

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
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 bg-muted/30 p-1 rounded-full w-fit">
              <button
                className={getSortButtonStyle(sortBy === "all")}
                onClick={() => setSortBy("all")}
              >
                全て
              </button>
              <button
                className={getSortButtonStyle(sortBy === "date")}
                onClick={() => setSortBy("date")}
              >
                日付
              </button>
              <button
                className={getSortButtonStyle(sortBy === "location")}
                onClick={() => setSortBy("location")}
              >
                場所
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {Array.from(groupedPlans.entries()).map(([group, plans]) => (
              <div key={group} className="space-y-4">
                <h2 className="text-xl font-semibold">{group}</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <AlbumCard key={plan.id} plan={plan} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
