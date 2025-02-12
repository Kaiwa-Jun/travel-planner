"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import DraggableScheduleItem, {
  type ScheduleItem,
} from "./DraggableScheduleItem";
import { ScheduleSkeleton } from "./ScheduleSkeleton";
import { useRef } from "react";

interface ScheduleListProps {
  scheduleItems: ScheduleItem[];
  editingId: number | null;
  editingItem: ScheduleItem | null;
  handleEdit: (item: ScheduleItem) => void;
  handleCancelEdit: () => void;
  handleSaveEdit: () => void;
  handleDelete: (id: number) => void;
  setEditingItem: React.Dispatch<React.SetStateAction<ScheduleItem | null>>;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  newItemId: number | null;
}

export const ScheduleList = ({
  scheduleItems,
  editingId,
  editingItem,
  handleEdit,
  handleCancelEdit,
  handleSaveEdit,
  handleDelete,
  setEditingItem,
  moveItem,
  newItemId,
}: ScheduleListProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<HTMLDivElement>(null);

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

  return (
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
  );
};
