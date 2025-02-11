"use client";

import { useState, useRef, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import {
  SavedPlans,
  createPlanAddedEvent,
  type SavedPlan,
} from "@/components/saved-planes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Clock,
  Plus,
  GripVertical,
  Pencil,
  Trash2,
  Check,
  X,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import type { Identifier } from "dnd-core";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { sampleSpots, type Spot } from "@/data/spots";
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

interface ScheduleItem {
  id: number;
  date: string; // YYYY-MM-DD形式
  time: string;
  title: string;
  location: string;
  image: string;
}

// プラン保存用のインターフェースを追加
interface Plan {
  title: string;
  schedules: ScheduleItem[];
}

const initialScheduleItems: ScheduleItem[] = [
  {
    id: 1,
    date: "2025-01-20",
    time: "10:00",
    title: "東京スカイツリー",
    location: "東京都墨田区押上",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    date: "2025-01-20",
    time: "11:30",
    title: "浅草寺",
    location: "東京都台東区浅草",
    image:
      "https://images.unsplash.com/photo-1570459027562-4a916cc6113f?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    date: "2025-01-21",
    time: "12:00",
    title: "上野動物園",
    location: "東京都台東区上野公園",
    image:
      "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800&auto=format&fit=crop&q=80",
  },
];

interface DragItem {
  index: number;
  id: number;
  type: string;
}

interface DraggableScheduleItemProps {
  item: ScheduleItem;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  editingId: number | null;
  editingItem: ScheduleItem | null;
  handleEdit: (item: ScheduleItem) => void;
  handleCancelEdit: () => void;
  handleSaveEdit: () => void;
  handleDelete: (id: number) => void;
  setEditingItem: React.Dispatch<React.SetStateAction<ScheduleItem | null>>;
  isNew: boolean;
}

const DraggableScheduleItem = ({
  item,
  index,
  moveItem,
  editingId,
  editingItem,
  handleEdit,
  handleCancelEdit,
  handleSaveEdit,
  handleDelete,
  setEditingItem,
  isNew,
}: DraggableScheduleItemProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "SCHEDULE_ITEM",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "SCHEDULE_ITEM",
    item: () => ({ id: item.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`group flex items-start gap-1 md:gap-2 p-2 md:p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-move ${
        isDragging ? "opacity-50" : ""
      }`}
      data-handler-id={handlerId}
      data-schedule-id={item.id}
    >
      <div className="flex items-center self-stretch text-muted-foreground">
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="flex items-center px-2 py-4">
        <div className="flex-shrink-0 w-20 md:w-20 aspect-[4/3]">
          <div
            className="w-full h-full rounded bg-cover bg-center"
            style={{ backgroundImage: `url(${item.image})` }}
          />
        </div>
      </div>
      {editingId === item.id ? (
        <div className="flex-grow space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={editingItem?.date}
              onChange={(e) => {
                const newDate = e.target.value;
                setEditingItem((prev: ScheduleItem | null) =>
                  prev ? { ...prev, date: newDate } : null
                );
              }}
              className="max-w-[160px]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Input
              type="time"
              value={editingItem?.time}
              onChange={(e) => {
                const newTime = e.target.value;
                setEditingItem((prev: ScheduleItem | null) =>
                  prev ? { ...prev, time: newTime } : null
                );
              }}
              className="max-w-[120px]"
            />
          </div>
          <Input
            value={editingItem?.title}
            onChange={(e) =>
              setEditingItem((prev: ScheduleItem | null) =>
                prev ? { ...prev, title: e.target.value } : null
              )
            }
            placeholder="スポット名"
          />
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Input
              value={editingItem?.location}
              onChange={(e) =>
                setEditingItem((prev: ScheduleItem | null) =>
                  prev ? { ...prev, location: e.target.value } : null
                )
              }
              placeholder="場所"
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelEdit}
              className="h-8 w-8 p-0"
              aria-label="キャンセル"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveEdit}
              className="h-8 w-8 p-0"
              aria-label="保存"
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-grow min-w-0 max-w-[calc(100%-4rem)]">
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Clock className="h-3 w-3 mr-1" />
              <span>{item.time}</span>
            </div>
            <h3 className="font-medium truncate">{item.title}</h3>
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{item.location}</span>
            </p>
          </div>
          <div className="flex flex-col gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(item)}
              className="h-8 w-8 p-0"
              aria-label="編集"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  aria-label="削除"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>スケジュールの削除</AlertDialogTitle>
                  <AlertDialogDescription>
                    「{item.title}」を削除してもよろしいですか？
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(item.id)}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    削除
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </>
      )}
    </motion.div>
  );
};

// スケジュールスケルトンコンポーネント
function ScheduleSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="font-medium text-lg flex items-center gap-2 text-muted-foreground sticky top-0 bg-background py-2">
          <Calendar className="h-4 w-4" />
          <div className="h-4 bg-muted rounded animate-pulse w-32" />
        </div>
        <div className="space-y-3 mt-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-start gap-2 p-3 border rounded-lg"
            >
              <div className="flex items-center self-stretch text-muted-foreground">
                <GripVertical className="h-4 w-4" />
              </div>
              <div className="flex items-center px-2 py-4">
                <div className="flex-shrink-0 w-20 md:w-20 aspect-[4/3]">
                  <div className="w-full h-full rounded bg-muted animate-pulse" />
                </div>
              </div>
              <div className="flex-grow space-y-2">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                  <div className="h-3 bg-muted rounded animate-pulse w-16" />
                </div>
                <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

export default function CreatePlanPage() {
  const [scheduleItems, setScheduleItems] =
    useState<ScheduleItem[]>(initialScheduleItems);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [newSchedule, setNewSchedule] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    time: "",
    title: "",
    location: "",
  });
  const [planTitle, setPlanTitle] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<Spot[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [newItemId, setNewItemId] = useState<number | null>(null);

  // 日付と時間でソートする関数
  const sortByDateTime = (a: ScheduleItem, b: ScheduleItem) => {
    const dateTimeA = new Date(`${a.date} ${a.time}`);
    const dateTimeB = new Date(`${b.date} ${b.time}`);
    return dateTimeA.getTime() - dateTimeB.getTime();
  };

  // 時間を再割り当てする関数
  const reassignTimes = (items: ScheduleItem[]) => {
    // 日付ごとにグループ化
    const groupedByDate = items.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = [];
      }
      acc[item.date].push(item);
      return acc;
    }, {} as Record<string, ScheduleItem[]>);

    // 各日付グループ内で時間を再割り当て
    const result: ScheduleItem[] = [];
    Object.entries(groupedByDate).forEach(([date, dateItems]) => {
      const times = dateItems
        .map((item) => item.time)
        .sort((a, b) => {
          const timeA = new Date(`1970/01/01 ${a}`);
          const timeB = new Date(`1970/01/01 ${b}`);
          return timeA.getTime() - timeB.getTime();
        });

      dateItems.forEach((item, index) => {
        result.push({
          ...item,
          time: times[index],
        });
      });
    });

    return result.sort(sortByDateTime);
  };

  // 日付ごとにスケジュールをグループ化する関数
  const groupSchedulesByDate = (items: ScheduleItem[]) => {
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = [];
      }
      acc[item.date].push(item);
      return acc;
    }, {} as Record<string, ScheduleItem[]>);

    // 日付でソート
    return Object.entries(grouped)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, items]) => ({
        date,
        items: items.sort((a, b) => a.time.localeCompare(b.time)),
      }));
  };

  const handleEdit = (item: ScheduleItem) => {
    setEditingId(item.id);
    setEditingItem(item);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingItem(null);
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      setScheduleItems((items) => {
        const updatedItems = items.map((item) =>
          item.id === editingItem.id ? editingItem : item
        );
        return updatedItems.sort(sortByDateTime);
      });
      setEditingId(null);
      setEditingItem(null);
    }
  };

  const handleDelete = (id: number) => {
    setScheduleItems((items) => items.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // すべての入力欄が入力されているかチェック
    if (
      !newSchedule.date ||
      !newSchedule.time ||
      !newSchedule.title ||
      !newSchedule.location
    ) {
      return;
    }

    const id = Math.max(0, ...scheduleItems.map((item) => item.id)) + 1;
    const newItem: ScheduleItem = {
      id,
      date: newSchedule.date,
      time: newSchedule.time,
      title: newSchedule.title,
      location: newSchedule.location,
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=80",
    };
    setScheduleItems((items) => {
      const newItems = [...items, newItem];
      return newItems.sort(sortByDateTime);
    });
    setNewSchedule({
      date: newSchedule.date,
      time: "",
      title: "",
      location: "",
    });
    setNewItemId(id);

    // スケジュール追加後、少し遅延を入れてスクロール
    setTimeout(() => {
      const newItemElement = document.querySelector(
        `[data-schedule-id="${id}"]`
      );
      if (newItemElement) {
        newItemElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    setScheduleItems((prevItems) => {
      const newItems = [...prevItems];
      const dragItem = newItems[dragIndex];
      newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, dragItem);
      return reassignTimes(newItems);
    });
  };

  // 日付をフォーマットする関数
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayIndex = groupedSchedules.findIndex(
      (group) => group.date === dateStr
    );
    const dayNumber = dayIndex + 1;
    return `${format(date, "M月d日(E)", { locale: ja })}  ${dayNumber}日目`;
  };

  const groupedSchedules = groupSchedulesByDate(scheduleItems);

  // キーボードイベントの処理を追加
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectSpot(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // 入力時の処理を修正
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewSchedule({
      ...newSchedule,
      title: value,
    });

    if (value.length > 0) {
      const filtered = sampleSpots.filter((spot) =>
        spot.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedIndex(-1); // 選択状態をリセット
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  // フォーカスが外れた時の処理を修正
  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  // サジェストアイテムを選択時の処理を修正
  const handleSelectSpot = (spot: Spot) => {
    setNewSchedule({
      ...newSchedule,
      title: spot.name,
      location: spot.location,
    });
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  // プラン保存のハンドラーを追加
  const handleSavePlan = () => {
    if (!planTitle || scheduleItems.length === 0) return;

    // スケジュールの日付を取得して開始日と終了日を決定
    const dates = scheduleItems.map((item) => new Date(item.date));
    const startDate = format(Math.min(...dates), "yyyy-MM-dd");
    const endDate = format(Math.max(...dates), "yyyy-MM-dd");

    // 最初のスケジュールの場所と画像を使用
    const firstSchedule = scheduleItems[0];

    const newPlan: SavedPlan = {
      id: Date.now(), // 一意のIDを生成
      title: planTitle,
      startDate,
      endDate,
      location: firstSchedule.location.split("（")[0], // 都道府県名のみを使用
      image: firstSchedule.image,
      scheduleCount: scheduleItems.length,
    };

    // カスタムイベントを発火して新しいプランを追加
    const event = createPlanAddedEvent(newPlan);
    window.dispatchEvent(event);

    // フォームをリセット
    setPlanTitle("");
    setScheduleItems([]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen">
        <Navigation />

        <main className="container pt-24 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 max-w-[1200px] mx-auto"
          >
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">プラン作成</h1>
            </div>

            <div className="grid md:grid-cols-[1fr,400px] gap-4 md:gap-8">
              {/* Left Column: Map and Saved Plans */}
              <div className="space-y-8">
                {/* Map Area */}
                <div className="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">地図が表示されます</p>
                </div>

                {/* Saved Plans Area */}
                <SavedPlans />
              </div>

              {/* Right Column: Schedule Area */}
              <Card className="w-full h-fit">
                <CardContent className="p-4 md:p-6 flex flex-col h-[calc(100vh-200px)] overflow-hidden">
                  <div className="flex items-center gap-4 mb-4">
                    <Input
                      placeholder="プランのタイトルを入力"
                      value={planTitle}
                      onChange={(e) => setPlanTitle(e.target.value)}
                      className="flex-1"
                    />
                  </div>

                  {/* Add Schedule Form */}
                  <form onSubmit={handleSubmit} className="mb-4 pb-4 border-b">
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="date"
                          value={newSchedule.date}
                          onChange={(e) =>
                            setNewSchedule({
                              ...newSchedule,
                              date: e.target.value,
                            })
                          }
                          className="max-w-[160px]"
                          required
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="time"
                          value={newSchedule.time}
                          onChange={(e) =>
                            setNewSchedule({
                              ...newSchedule,
                              time: e.target.value,
                            })
                          }
                          placeholder="時間"
                          className="max-w-[120px]"
                          required
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4" />
                        <div className="relative w-full">
                          <Input
                            value={newSchedule.title}
                            onChange={handleTitleChange}
                            onKeyDown={handleKeyDown}
                            onFocus={() =>
                              setShowSuggestions(newSchedule.title.length > 0)
                            }
                            onBlur={handleBlur}
                            placeholder="スポット名"
                            required
                          />
                          {showSuggestions && (
                            <div
                              className="absolute left-0 right-0 mt-1 bg-background border rounded-md shadow-lg"
                              style={{ zIndex: 9999 }}
                            >
                              <div className="max-h-[400px] overflow-y-auto">
                                {suggestions.map((spot, index) => (
                                  <button
                                    key={spot.id}
                                    className={`w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2 ${
                                      index === selectedIndex ? "bg-muted" : ""
                                    }`}
                                    onClick={() => handleSelectSpot(spot)}
                                    type="button"
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    onMouseDown={(e) => e.preventDefault()}
                                  >
                                    <div
                                      className="w-8 h-8 rounded bg-cover bg-center flex-shrink-0"
                                      style={{
                                        backgroundImage: `url(${spot.image})`,
                                      }}
                                    />
                                    <div>
                                      <div className="font-medium">
                                        {spot.name}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        {spot.location}
                                      </div>
                                    </div>
                                  </button>
                                ))}
                                {suggestions.length === 0 &&
                                  newSchedule.title.length > 0 && (
                                    <div className="px-4 py-2 text-sm text-muted-foreground">
                                      該当するスポットが見つかりません
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={
                          !newSchedule.date ||
                          !newSchedule.time ||
                          !newSchedule.title ||
                          !newSchedule.location
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        スケジュールを追加
                      </Button>
                    </div>
                  </form>

                  <ScrollArea className="flex-1">
                    <div className="space-y-6" ref={scrollContainerRef}>
                      {scheduleItems.length > 0 ? (
                        groupedSchedules.map(({ date, items }, groupIndex) => (
                          <div
                            key={date}
                            className="space-y-3"
                            ref={
                              groupIndex === groupedSchedules.length - 1
                                ? lastItemRef
                                : undefined
                            }
                          >
                            <h3 className="font-medium text-lg flex items-center gap-2 text-muted-foreground sticky top-0 bg-background py-2">
                              <Calendar className="h-4 w-4" />
                              {formatDate(date)}
                            </h3>
                            {items.map((item, index) => (
                              <DraggableScheduleItem
                                key={item.id}
                                item={item}
                                index={index}
                                moveItem={moveItem}
                                editingId={editingId}
                                editingItem={editingItem}
                                handleEdit={handleEdit}
                                handleCancelEdit={handleCancelEdit}
                                handleSaveEdit={handleSaveEdit}
                                handleDelete={handleDelete}
                                setEditingItem={setEditingItem}
                                isNew={item.id === newItemId}
                              />
                            ))}
                          </div>
                        ))
                      ) : (
                        <ScheduleSkeleton />
                      )}
                    </div>
                  </ScrollArea>

                  <div className="mt-4 pt-4 border-t">
                    <Button
                      onClick={handleSavePlan}
                      disabled={!planTitle || scheduleItems.length === 0}
                      className="w-full"
                    >
                      プランを保存
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </DndProvider>
  );
}
