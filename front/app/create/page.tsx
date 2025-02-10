"use client";

import { useState, useRef } from "react";
import { Navigation } from "@/components/navigation";
import { SavedPlans } from "@/components/saved-planes";
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

interface ScheduleItem {
  id: number;
  date: string; // YYYY-MM-DD形式
  time: string;
  title: string;
  location: string;
  image: string;
}

const initialScheduleItems: ScheduleItem[] = [
  {
    id: 1,
    date: "2024-03-20",
    time: "10:00",
    title: "東京スカイツリー",
    location: "東京都墨田区押上",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    date: "2024-03-20",
    time: "11:30",
    title: "浅草寺",
    location: "東京都台東区浅草",
    image:
      "https://images.unsplash.com/photo-1570459027562-4a916cc6113f?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    date: "2024-03-21",
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
    >
      <div className="flex items-center self-stretch text-muted-foreground">
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="flex-shrink-0 w-16 md:w-20 aspect-[4/3]">
        <div
          className="w-full h-full rounded bg-cover bg-center"
          style={{ backgroundImage: `url(${item.image})` }}
        />
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
            placeholder="タイトル"
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
          <div className="flex-grow min-w-0 max-w-[calc(100%-5rem)]">
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(item.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              aria-label="削除"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </motion.div>
  );
};

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
    const newItem: ScheduleItem = {
      id: Math.max(0, ...scheduleItems.map((item) => item.id)) + 1,
      date: newSchedule.date,
      time: newSchedule.time,
      title: newSchedule.title,
      location: newSchedule.location,
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=80", // デフォルト画像
    };
    setScheduleItems((items) => {
      const newItems = [...items, newItem];
      return newItems.sort(sortByDateTime);
    });
    setNewSchedule({
      date: newSchedule.date, // 日付は保持
      time: "",
      title: "",
      location: "",
    });
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
    return format(date, "M月d日(E)", { locale: ja });
  };

  const groupedSchedules = groupSchedulesByDate(scheduleItems);

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

            <div className="grid md:grid-cols-[1fr,320px] gap-4 md:gap-8">
              {/* Map Area */}
              <div className="md:order-1">
                <div className="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">地図が表示されます</p>
                </div>
              </div>

              {/* Schedule Area */}
              <Card className="md:order-2 w-full">
                <CardContent className="p-4 md:p-6 flex flex-col h-[calc(100vh-200px)] overflow-hidden">
                  <h2 className="text-xl font-semibold mb-4">スケジュール</h2>
                  <ScrollArea className="flex-1 mb-4">
                    <div className="space-y-6">
                      {groupedSchedules.map(({ date, items }, groupIndex) => (
                        <div key={date} className="space-y-3">
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
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Add Schedule Form */}
                  <form
                    onSubmit={handleSubmit}
                    className="border-t pt-3 md:pt-4"
                  >
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
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4" />
                        <Input
                          value={newSchedule.title}
                          onChange={(e) =>
                            setNewSchedule({
                              ...newSchedule,
                              title: e.target.value,
                            })
                          }
                          placeholder="タイトル"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <Input
                          value={newSchedule.location}
                          onChange={(e) =>
                            setNewSchedule({
                              ...newSchedule,
                              location: e.target.value,
                            })
                          }
                          placeholder="場所"
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        スケジュールを追加
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Saved Plans Area */}
              <div className="md:order-3 md:col-span-2">
                <SavedPlans />
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </DndProvider>
  );
}
