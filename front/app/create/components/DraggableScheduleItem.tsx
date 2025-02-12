"use client";

import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { Identifier } from "dnd-core";
import { motion } from "framer-motion";
import {
  GripVertical,
  Clock,
  MapPin,
  Calendar,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export interface ScheduleItem {
  id: number;
  date: string;
  time: string;
  title: string;
  location: string;
  image: string;
}

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

export const DraggableScheduleItem = ({
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
                setEditingItem((prev) =>
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
                setEditingItem((prev) =>
                  prev ? { ...prev, time: newTime } : null
                );
              }}
              className="max-w-[120px]"
            />
          </div>
          <Input
            value={editingItem?.title}
            onChange={(e) =>
              setEditingItem((prev) =>
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
                setEditingItem((prev) =>
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
