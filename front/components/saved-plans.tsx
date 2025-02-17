"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Calendar, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { type SavedPlan, type Schedule } from "@/types/schedule";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MapSection } from "@/app/create/components/MapSection";

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
    schedules: [
      {
        id: 1,
        title: "浅草寺参拝",
        date: "2024-03-20",
        startTime: "09:00",
        endTime: "11:00",
        location: "浅草寺",
        memo: "朝早めに行って混雑を避ける",
        prefectureCode: "13",
      },
      {
        id: 2,
        title: "スカイツリー見学",
        date: "2024-03-20",
        startTime: "13:00",
        endTime: "15:00",
        location: "東京スカイツリー",
        prefectureCode: "13",
      },
      {
        id: 3,
        title: "秋葉原散策",
        date: "2024-03-21",
        startTime: "10:00",
        endTime: "14:00",
        location: "秋葉原",
        prefectureCode: "13",
      },
      {
        id: 4,
        title: "チームラボプラネッツ",
        date: "2024-03-21",
        startTime: "15:00",
        endTime: "17:00",
        location: "豊洲",
        prefectureCode: "13",
      },
      {
        id: 5,
        title: "築地市場グルメツアー",
        date: "2024-03-22",
        startTime: "08:00",
        endTime: "10:00",
        location: "築地",
        prefectureCode: "13",
      },
      {
        id: 6,
        title: "皇居散策",
        date: "2024-03-22",
        startTime: "11:00",
        endTime: "13:00",
        location: "皇居",
        prefectureCode: "13",
      },
      {
        id: 7,
        title: "銀座ショッピング",
        date: "2024-03-22",
        startTime: "14:00",
        endTime: "17:00",
        location: "銀座",
        prefectureCode: "13",
      },
      {
        id: 8,
        title: "六本木ディナー",
        date: "2024-03-22",
        startTime: "18:00",
        endTime: "20:00",
        location: "六本木",
        prefectureCode: "13",
      },
    ],
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
    schedules: [
      {
        id: 1,
        title: "金閣寺見学",
        date: "2024-04-05",
        startTime: "09:00",
        endTime: "11:00",
        location: "金閣寺",
        prefectureCode: "26",
      },
      {
        id: 2,
        title: "龍安寺",
        date: "2024-04-05",
        startTime: "13:00",
        endTime: "15:00",
        location: "龍安寺",
        prefectureCode: "26",
      },
      {
        id: 3,
        title: "伏見稲荷大社",
        date: "2024-04-06",
        startTime: "08:00",
        endTime: "11:00",
        location: "伏見稲荷大社",
        memo: "千本鳥居を散策",
        prefectureCode: "26",
      },
      {
        id: 4,
        title: "清水寺",
        date: "2024-04-06",
        startTime: "14:00",
        endTime: "16:00",
        location: "清水寺",
        prefectureCode: "26",
      },
      {
        id: 5,
        title: "祇園散策",
        date: "2024-04-07",
        startTime: "10:00",
        endTime: "12:00",
        location: "祇園",
        prefectureCode: "26",
      },
      {
        id: 6,
        title: "嵐山散策",
        date: "2024-04-07",
        startTime: "14:00",
        endTime: "17:00",
        location: "嵐山",
        memo: "竹林の小径を散策",
        prefectureCode: "26",
      },
    ],
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
    schedules: [
      {
        id: 1,
        title: "黒門市場散策",
        date: "2024-05-10",
        startTime: "10:00",
        endTime: "12:00",
        location: "黒門市場",
        prefectureCode: "27",
      },
      {
        id: 2,
        title: "道頓堀グルメ",
        date: "2024-05-10",
        startTime: "15:00",
        endTime: "18:00",
        location: "道頓堀",
        memo: "たこ焼きと串カツを堪能",
        prefectureCode: "27",
      },
      {
        id: 3,
        title: "大阪城見学",
        date: "2024-05-11",
        startTime: "09:00",
        endTime: "12:00",
        location: "大阪城",
        prefectureCode: "27",
      },
      {
        id: 4,
        title: "新世界探索",
        date: "2024-05-11",
        startTime: "14:00",
        endTime: "17:00",
        location: "新世界",
        prefectureCode: "27",
      },
      {
        id: 5,
        title: "あべのハルカス",
        date: "2024-05-12",
        startTime: "10:00",
        endTime: "13:00",
        location: "あべのハルカス",
        memo: "展望台から大阪の街並みを一望",
        prefectureCode: "27",
      },
    ],
  },
];

// プラン追加用のカスタムイベント名
export const PLAN_ADDED_EVENT = "planAdded";
export const PLAN_EDIT_EVENT = "planEdit";
export const PLANS_STORAGE_KEY = "savedPlans";
export const MARKERS_UPDATE_EVENT = "markersUpdate";

// プラン追加用のカスタムイベントを作成
export const createPlanAddedEvent = (plan: SavedPlan) => {
  return new CustomEvent(PLAN_ADDED_EVENT, { detail: plan });
};

// プラン編集用のカスタムイベントを作成
export const createPlanEditEvent = (plan: SavedPlan) => {
  return new CustomEvent(PLAN_EDIT_EVENT, { detail: plan });
};

// マーカー更新用のカスタムイベントを作成
export const createMarkersUpdateEvent = (
  markers: { prefectureCode: string; title: string }[]
) => {
  return new CustomEvent(MARKERS_UPDATE_EVENT, { detail: markers });
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

// 都道府県コードと名称のマッピング
const prefectureMap: { [key: string]: string } = {
  "01": "北海道",
  "02": "青森県",
  "03": "岩手県",
  "04": "宮城県",
  "05": "秋田県",
  "06": "山形県",
  "07": "福島県",
  "08": "茨城県",
  "09": "栃木県",
  "10": "群馬県",
  "11": "埼玉県",
  "12": "千葉県",
  "13": "東京都",
  "14": "神奈川県",
  "15": "新潟県",
  "16": "富山県",
  "17": "石川県",
  "18": "福井県",
  "19": "山梨県",
  "20": "長野県",
  "21": "岐阜県",
  "22": "静岡県",
  "23": "愛知県",
  "24": "三重県",
  "25": "滋賀県",
  "26": "京都府",
  "27": "大阪府",
  "28": "兵庫県",
  "29": "奈良県",
  "30": "和歌山県",
  "31": "鳥取県",
  "32": "島根県",
  "33": "岡山県",
  "34": "広島県",
  "35": "山口県",
  "36": "徳島県",
  "37": "香川県",
  "38": "愛媛県",
  "39": "高知県",
  "40": "福岡県",
  "41": "佐賀県",
  "42": "長崎県",
  "43": "熊本県",
  "44": "大分県",
  "45": "宮崎県",
  "46": "鹿児島県",
  "47": "沖縄県",
};

// 保存済みプランカードコンポーネント
function SavedPlanCard({
  plan,
  onDelete,
  activeFilter,
  onAlbumStateChange,
}: {
  plan: SavedPlan;
  onDelete: (id: number) => void;
  activeFilter: "all" | "noPhoto" | "completed";
  onAlbumStateChange: (planId: number, hasAlbum: boolean) => void;
}) {
  const [hasAlbum, setHasAlbum] = useState(plan.hasAlbum || false);
  const router = useRouter();

  // hasAlbumの変更をplanオブジェクトに反映
  const handleAlbumStateChange = (newState: boolean) => {
    setHasAlbum(newState);
    onAlbumStateChange(plan.id, newState);
    const savedPlans = JSON.parse(
      localStorage.getItem(PLANS_STORAGE_KEY) || "[]"
    );
    const updatedPlans = savedPlans.map((p: SavedPlan) =>
      p.id === plan.id ? { ...p, hasAlbum: newState } : p
    );
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(updatedPlans));
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = format(new Date(startDate), "M/d(E)", { locale: ja });
    const end = format(new Date(endDate), "M/d(E)", { locale: ja });
    return `${start} 〜 ${end}`;
  };

  const handleEdit = () => {
    const event = createPlanEditEvent(plan);
    window.dispatchEvent(event);
  };

  const handleDelete = () => {
    onDelete(plan.id);
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
          <div className="flex items-center justify-between mb-2">
            <motion.h3
              className="font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {plan.title}
            </motion.h3>
            <div className="flex gap-1">
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                className="md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleEdit}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                className="md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
              >
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>プランの削除</AlertDialogTitle>
                      <AlertDialogDescription>
                        このプランを削除してもよろしいですか？
                        <div className="mt-2 p-4 bg-muted rounded-lg">
                          <p className="font-medium">{plan.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDateRange(plan.startDate, plan.endDate)}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {plan.scheduleCount}件のスケジュール
                          </p>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        削除
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </motion.div>
            </div>
          </div>
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
              <span className="truncate">{plan.location}</span>
            </div>
            <div className="flex items-center">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {plan.scheduleCount}件のスケジュール
              </div>
            </div>
          </motion.div>
          <div className="mt-4 pt-4 border-t">
            <Button
              variant={hasAlbum ? "default" : "secondary"}
              size="sm"
              className={`w-full ${
                hasAlbum
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-rose-600 hover:bg-rose-700 text-white"
              }`}
              onClick={() => {
                if (hasAlbum) {
                  router.push(`/albums/${plan.id}`);
                } else {
                  handleAlbumStateChange(true);
                  // TODO: 写真追加の処理を実装
                  console.log("写真を追加", plan.id);
                }
              }}
            >
              {(() => {
                if (activeFilter === "all") {
                  return hasAlbum ? "アルバムを見る" : "写真を追加";
                } else if (activeFilter === "noPhoto") {
                  return "写真を追加";
                } else {
                  return "アルバムを見る";
                }
              })()}
            </Button>
          </div>
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

export const SavedPlans = () => {
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "noPhoto" | "completed"
  >("all");
  const [sortBy, setSortBy] = useState<"date" | "location">("date");

  // アルバム状態変更のハンドラー
  const handleAlbumStateChange = (planId: number, hasAlbum: boolean) => {
    setPlans((prevPlans) => {
      const updatedPlans = prevPlans.map((plan) =>
        plan.id === planId ? { ...plan, hasAlbum } : plan
      );
      return updatedPlans;
    });
  };

  // フィルター用のボタンスタイル
  const getFilterButtonStyle = (isActive: boolean) => {
    return `px-4 py-2 text-sm rounded-full transition-colors ${
      isActive
        ? "bg-primary text-primary-foreground"
        : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
    }`;
  };

  // ソート用のボタンスタイル
  const getSortButtonStyle = (isActive: boolean) => {
    return `px-4 py-2 text-sm rounded-full transition-colors ${
      isActive
        ? "bg-primary text-primary-foreground"
        : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
    }`;
  };

  // 住所から都道府県コードを取得する関数
  const getPrefectureCodeFromLocation = (location: string): string => {
    // 都道府県名のリスト（長い順にソート）
    const prefNames = Object.entries(prefectureMap)
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => b.name.length - a.name.length);

    // 住所から都道府県を検出
    for (const { code, name } of prefNames) {
      if (location.includes(name)) {
        return code;
      }
    }
    return "04"; // 宮城県をデフォルトに
  };

  // フィルター適用後のプラン
  const filteredAndSortedPlans = useMemo(() => {
    let result = [...plans];

    // フィルターの適用
    switch (activeFilter) {
      case "noPhoto":
        result = result.filter((plan) => !plan.hasAlbum);
        break;
      case "completed":
        result = result.filter((plan) => plan.hasAlbum);
        break;
    }

    // ソートの適用
    switch (sortBy) {
      case "date":
        result.sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        break;
      case "location":
        // 都道府県名でソート
        result.sort((a, b) => {
          const prefCodeA = getPrefectureCodeFromLocation(
            a.schedules[0].location
          );
          const prefCodeB = getPrefectureCodeFromLocation(
            b.schedules[0].location
          );
          const prefA = prefectureMap[prefCodeA];
          const prefB = prefectureMap[prefCodeB];
          return prefA.localeCompare(prefB, "ja");
        });
        break;
    }

    return result;
  }, [plans, activeFilter, sortBy]);

  // プランをグループ化
  const groupedPlans = useMemo(() => {
    const result = new Map<string, SavedPlan[]>();

    if (sortBy === "date") {
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

      // グループを日付の降順でソート
      return new Map(
        Array.from(result.entries()).sort((a, b) => {
          const dateA = new Date(a[1][0].startDate);
          const dateB = new Date(b[1][0].startDate);
          return dateB.getTime() - dateA.getTime();
        })
      );
    } else {
      // 都道府県別でグループ化
      filteredAndSortedPlans.forEach((plan) => {
        const prefCode = getPrefectureCodeFromLocation(
          plan.schedules[0].location
        );
        const prefName = prefectureMap[prefCode];
        if (!result.has(prefName)) {
          result.set(prefName, []);
        }
        result.get(prefName)?.push(plan);
      });

      // 都道府県名でソート（五十音順）
      return new Map(
        Array.from(result.entries()).sort((a, b) =>
          a[0].localeCompare(b[0], "ja")
        )
      );
    }
  }, [filteredAndSortedPlans, sortBy]);

  // マーカー情報の生成と更新イベントの発行
  useEffect(() => {
    const newMarkers = plans.map((plan) => ({
      prefectureCode: plan.schedules[0].prefectureCode,
      title: plan.title,
    }));
    // マーカー情報が変更されたら、イベントを発行
    const event = createMarkersUpdateEvent(newMarkers);
    window.dispatchEvent(event);
  }, [plans]);

  // 初期データの読み込み
  useEffect(() => {
    const savedPlans = localStorage.getItem(PLANS_STORAGE_KEY);
    const unsortedPlans = savedPlans
      ? JSON.parse(savedPlans)
      : initialSavedPlans;
    const sortedPlans = [...unsortedPlans].sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    setPlans(sortedPlans);
  }, []);

  // プラン追加イベントのリスナー
  useEffect(() => {
    const handlePlanAdded = (event: CustomEvent<SavedPlan>) => {
      const newPlan = event.detail;
      setPlans((prevPlans) => {
        let updatedPlans;
        // 編集の場合は既存のプランを更新
        if (prevPlans.some((plan) => plan.id === newPlan.id)) {
          updatedPlans = prevPlans.map((plan) =>
            plan.id === newPlan.id ? newPlan : plan
          );
        } else {
          // 新規作成の場合は配列に追加
          updatedPlans = [...prevPlans, newPlan];
        }
        // startDateでソート
        const sortedPlans = updatedPlans.sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
        // LocalStorageに保存
        localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(sortedPlans));
        return sortedPlans;
      });
    };

    window.addEventListener(PLAN_ADDED_EVENT, handlePlanAdded as EventListener);
    return () => {
      window.removeEventListener(
        PLAN_ADDED_EVENT,
        handlePlanAdded as EventListener
      );
    };
  }, []);

  const handleDelete = (planId: number) => {
    setPlans((prevPlans) => {
      const updatedPlans = prevPlans.filter((plan) => plan.id !== planId);
      localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(updatedPlans));
      // プラン削除後にマーカー情報を更新
      const newMarkers = updatedPlans.map((plan) => ({
        prefectureCode: plan.schedules[0].prefectureCode,
        title: plan.title,
      }));
      const event = createMarkersUpdateEvent(newMarkers);
      window.dispatchEvent(event);
      return updatedPlans;
    });
  };

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants}>
      <div className="flex flex-col space-y-4">
        <motion.h2
          className="text-2xl font-semibold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          プラン＆アルバム
        </motion.h2>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 bg-muted/30 p-1 rounded-full w-fit">
            <button
              className={getFilterButtonStyle(activeFilter === "all")}
              onClick={() => setActiveFilter("all")}
            >
              すべて
            </button>
            <button
              className={getFilterButtonStyle(activeFilter === "noPhoto")}
              onClick={() => setActiveFilter("noPhoto")}
            >
              プラン
            </button>
            <button
              className={getFilterButtonStyle(activeFilter === "completed")}
              onClick={() => setActiveFilter("completed")}
            >
              アルバム
            </button>
          </div>
          <div className="flex gap-2 bg-muted/30 p-1 rounded-full w-fit">
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
      </div>
      <div className="mt-8 space-y-8">
        {Array.from(groupedPlans.entries()).map(([group, plans]) => (
          <div key={group} className="space-y-4">
            <h3 className="text-xl font-semibold">{group}</h3>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
            >
              {plans.map((plan) => (
                <SavedPlanCard
                  key={plan.id}
                  plan={plan}
                  onDelete={handleDelete}
                  activeFilter={activeFilter}
                  onAlbumStateChange={handleAlbumStateChange}
                />
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
