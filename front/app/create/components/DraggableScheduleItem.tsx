"use client";

import { forwardRef, useState } from "react";
import { useDrag } from "react-dnd";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Clock, MapPin, Pencil, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePlacesAutocomplete } from "../hooks/usePlacesAutocomplete";
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

    const {
      suggestions,
      showSuggestions,
      selectedIndex,
      setShowSuggestions,
      setSelectedIndex,
      setSearchTerm,
    } = usePlacesAutocomplete();

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setEditingItem((prev) =>
        prev ? { ...prev, title: e.target.value } : null
      );
    };

    const handleSpotSelect = (spot: any) => {
      setEditingItem((prev) =>
        prev
          ? {
              ...prev,
              title: spot.name,
              location: spot.location,
              image: spot.image,
            }
          : null
      );
      setShowSuggestions(false);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditingItem((prev) =>
        prev ? { ...prev, date: e.target.value } : null
      );
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditingItem((prev) =>
        prev ? { ...prev, time: e.target.value } : null
      );
    };

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
            {editingId === item.id ? (
              <div className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <Input
                      type="date"
                      value={editingItem?.date || ""}
                      onChange={handleDateChange}
                      className="max-w-[160px]"
                    />
                    <Input
                      type="time"
                      value={editingItem?.time || ""}
                      onChange={handleTimeChange}
                      className="max-w-[120px]"
                    />
                  </div>
                  <div className="relative">
                    <Input
                      value={editingItem?.title || ""}
                      onChange={handleTitleChange}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="スポット名"
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50">
                        <div className="max-h-[200px] overflow-y-auto">
                          {suggestions.map((spot, index) => (
                            <button
                              key={spot.id}
                              className={`w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2 ${
                                index === selectedIndex ? "bg-muted" : ""
                              }`}
                              onClick={() => handleSpotSelect(spot)}
                              onMouseEnter={() => setSelectedIndex(index)}
                            >
                              <div
                                className="w-8 h-8 rounded bg-cover bg-center flex-shrink-0"
                                style={{
                                  backgroundImage: `url(${spot.image})`,
                                }}
                              />
                              <div>
                                <div className="font-medium">{spot.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {spot.location}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="h-8"
                  >
                    <X className="h-4 w-4 mr-1" />
                    キャンセル
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSaveEdit}
                    className="h-8"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    保存
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {format(new Date(item.date), "yyyy年MM月dd日")}{" "}
                      {item.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {item.location}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground hidden md:hidden md:group-hover:block w-8 h-8 p-0"
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="h-4 w-4 mx-auto" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90 hidden md:hidden md:group-hover:block w-8 h-8 p-0"
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
              </>
            )}
          </div>
        </Card>
      </motion.div>
    );
  }
);

DraggableScheduleItem.displayName = "DraggableScheduleItem";

export default DraggableScheduleItem;
