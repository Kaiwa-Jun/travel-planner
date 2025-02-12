"use client";

import { forwardRef } from "react";
import { useDrag } from "react-dnd";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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

const DraggableScheduleItem = forwardRef<
  HTMLDivElement,
  DraggableScheduleItemProps
>(
  (
    {
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
    },
    ref
  ) => {
    const [{ isDragging }, drag] = useDrag({
      type: "SCHEDULE_ITEM",
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <motion.div
        ref={(node) => {
          drag(node);
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        data-schedule-id={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <Card className="p-4 mb-4 cursor-move group">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <span className="mr-2">🕒</span>
                  {format(new Date(item.date), "yyyy年MM月dd日")} {item.time}
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📍</span>
                  {item.location}
                </div>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive/90 block md:hidden md:group-hover:block w-8 h-8 p-0"
                >
                  <Trash2 className="h-4 w-4 mx-auto" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>スケジュールの削除</AlertDialogTitle>
                  <AlertDialogDescription>
                    このスケジュールを削除してもよろしいですか？
                    <div className="mt-2 p-4 bg-muted rounded-lg">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(item.date), "yyyy年MM月dd日")}{" "}
                        {item.time}
                      </p>
                    </div>
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
        </Card>
      </motion.div>
    );
  }
);

DraggableScheduleItem.displayName = "DraggableScheduleItem";

export default DraggableScheduleItem;
