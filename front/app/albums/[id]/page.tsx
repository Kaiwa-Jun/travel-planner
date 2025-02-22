"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { motion } from "framer-motion";
import { type SavedPlan } from "@/types/schedule";
import { PLANS_STORAGE_KEY } from "@/components/saved-plans";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const scheduleVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export default function AlbumPage({ params }: { params: { id: string } }) {
  const [plan, setPlan] = useState<SavedPlan | null>(null);

  useEffect(() => {
    const savedPlans = localStorage.getItem(PLANS_STORAGE_KEY);
    if (savedPlans) {
      const plans: SavedPlan[] = JSON.parse(savedPlans);
      const targetPlan = plans.find((p) => p.id === parseInt(params.id));
      if (targetPlan) {
        setPlan(targetPlan);
      }
    }
  }, [params.id]);

  if (!plan) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container pt-24 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">アルバムが見つかりません</h1>
          </div>
        </div>
      </div>
    );
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = format(new Date(startDate), "M月d日(E)", { locale: ja });
    const end = format(new Date(endDate), "M月d日(E)", { locale: ja });
    return `${start} 〜 ${end}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container pt-24 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* ヘッダー部分 */}
          <div className="relative h-[300px] rounded-xl overflow-hidden mb-8">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${plan.image})` }}
            />
            <div className="absolute inset-0 bg-black/50 flex items-end">
              <div className="p-8 text-white">
                <h1 className="text-4xl font-bold mb-4">{plan.title}</h1>
                <div className="flex items-center gap-6 text-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {formatDateRange(plan.startDate, plan.endDate)}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {plan.location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* スケジュール一覧 */}
          <div className="relative space-y-6 pl-4">
            {/* タイムライン用の縦線 */}
            <div className="absolute left-[27px] top-[40px] bottom-8 w-0.5 bg-muted z-0" />

            {plan.schedules.map((schedule, index) => (
              <motion.div
                key={schedule.id}
                variants={scheduleVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* 日付が変わる場合のみ日付ヘッダーを表示 */}
                {(index === 0 ||
                  schedule.date !== plan.schedules[index - 1].date) && (
                  <div className="absolute -left-8 flex items-center gap-1 mb-4 z-10 bg-background">
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-primary">
                        {format(new Date(schedule.date), "M/d", { locale: ja })}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">
                        {format(new Date(schedule.date), "E", { locale: ja })}
                      </span>
                    </div>
                  </div>
                )}

                {/* スケジュールカード */}
                <div
                  className={`relative ${
                    index === 0 ||
                    schedule.date !== plan.schedules[index - 1].date
                      ? "mt-12 first:mt-16"
                      : "mt-6"
                  }`}
                >
                  {/* タイムラインのポイント - 日付が変わる場合のみ表示 */}
                  {(index === 0 ||
                    schedule.date !== plan.schedules[index - 1].date) && (
                    <div className="absolute -left-[18px] top-6 w-3 h-3 rounded-full bg-primary ring-4 ring-background z-10" />
                  )}

                  <Card className="ml-6 relative z-[5]">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-20 text-sm font-medium text-primary">
                          {schedule.startTime}
                          <br />
                          {schedule.endTime}
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold mb-2">
                            {schedule.title}
                          </h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-1" />
                            {schedule.location}
                          </div>
                          {schedule.memo && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              {schedule.memo}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
