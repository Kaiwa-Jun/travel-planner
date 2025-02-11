"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Calendar, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

// 保存済みプランのインターフェース
export interface SavedPlan {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  image: string;
  scheduleCount: number;
}

// サンプルの保存済みプラン
const initialSavedPlans: SavedPlan[] = [
  {
    id: 1,
    title: "東京観光プラン",
    startDate: "2024-03-20",
    endDate: "2024-03-22",
    location: "東京",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=80",
    scheduleCount: 8,
  },
  {
    id: 2,
    title: "京都旅行",
    startDate: "2024-04-05",
    endDate: "2024-04-07",
    location: "京都",
    image:
      "https://images.unsplash.com/photo-1624253321171-1be53e12f5f4?w=800&auto=format&fit=crop&q=80",
    scheduleCount: 6,
  },
  {
    id: 3,
    title: "大阪グルメツアー",
    startDate: "2024-05-10",
    endDate: "2024-05-12",
    location: "大阪",
    image:
      "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&auto=format&fit=crop&q=80",
    scheduleCount: 5,
  },
];

// プラン追加用のカスタムイベント名
export const PLAN_ADDED_EVENT = "planAdded";

// プラン追加用のカスタムイベントを作成
export const createPlanAddedEvent = (plan: SavedPlan) => {
  return new CustomEvent(PLAN_ADDED_EVENT, { detail: plan });
};

// アニメーションのバリアント定義
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const imageVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
    },
  },
};

const buttonVariants = {
  hover: {
    x: 5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

// 保存済みプランカードコンポーネント
function SavedPlanCard({ plan }: { plan: SavedPlan }) {
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = format(new Date(startDate), "M月d日(E)", { locale: ja });
    const end = format(new Date(endDate), "M月d日(E)", { locale: ja });
    return `${start} 〜 ${end}`;
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className="overflow-hidden group">
        <motion.div
          className="aspect-[16/9] bg-cover bg-center"
          style={{ backgroundImage: `url(${plan.image})` }}
          variants={imageVariants}
          whileHover="hover"
        />
        <CardContent className="p-4">
          <motion.h3
            className="font-semibold mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {plan.title}
          </motion.h3>
          <motion.div
            className="space-y-1 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDateRange(plan.startDate, plan.endDate)}
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              {plan.location}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {plan.scheduleCount}件のスケジュール
              </div>
              <motion.div variants={buttonVariants} whileHover="hover">
                <Button variant="ghost" size="sm" className="gap-1">
                  編集
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// スケルトンカードコンポーネント
function SkeletonCard() {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className="overflow-hidden group">
        <div className="aspect-[16/9] bg-muted animate-pulse" />
        <CardContent className="p-4 space-y-3">
          <div className="h-6 bg-muted rounded animate-pulse w-3/4" />
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="h-4 w-4 bg-muted rounded mr-2 animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 bg-muted rounded mr-2 animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-4 w-4 bg-muted rounded mr-2 animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse w-24" />
              </div>
              <div className="h-8 w-16 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function SavedPlans() {
  const [plans, setPlans] = useState<SavedPlan[]>(initialSavedPlans);

  useEffect(() => {
    // プラン追加イベントのリスナーを設定
    const handlePlanAdded = (event: CustomEvent<SavedPlan>) => {
      setPlans((prevPlans) => {
        const newPlans = [...prevPlans, event.detail];
        // 開始日の降順でソート
        return newPlans.sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      });
    };

    // イベントリスナーを追加
    window.addEventListener(PLAN_ADDED_EVENT, handlePlanAdded as EventListener);

    // クリーンアップ
    return () => {
      window.removeEventListener(
        PLAN_ADDED_EVENT,
        handlePlanAdded as EventListener
      );
    };
  }, []);

  // 初期表示時にも日付順でソート
  useEffect(() => {
    setPlans((prevPlans) =>
      [...prevPlans].sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      )
    );
  }, []);

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants}>
      <motion.h2
        className="text-2xl font-semibold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        保存したプラン
      </motion.h2>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 max-w-6xl mx-auto"
        variants={containerVariants}
      >
        {plans.length > 0 ? (
          plans.map((plan) => <SavedPlanCard key={plan.id} plan={plan} />)
        ) : (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
