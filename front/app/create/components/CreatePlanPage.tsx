"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import {
  SavedPlans,
  createPlanAddedEvent,
  type SavedPlan,
} from "@/components/saved-plans";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { format } from "date-fns";
import { sampleSpots, type Spot } from "@/data/spots";
import { type ScheduleItem } from "./DraggableScheduleItem";
import { MapSection } from "./MapSection";
import { AddScheduleForm } from "./AddScheduleForm";
import { ScheduleList } from "./ScheduleList";
import { usePlacesAutocomplete } from "../hooks/usePlacesAutocomplete";
import { useScheduleSorting } from "../hooks/useScheduleSorting";

export const CreatePlanPageContent = () => {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [newSchedule, setNewSchedule] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    time: "",
    title: "",
    location: "",
  });
  const [planTitle, setPlanTitle] = useState("");
  const [newItemId, setNewItemId] = useState<number | null>(null);

  const {
    suggestions,
    showSuggestions,
    selectedIndex,
    setShowSuggestions,
    setSelectedIndex,
    setSearchTerm,
  } = usePlacesAutocomplete();

  const { sortByDateTime, reassignTimes } = useScheduleSorting();

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

  // キーボードイベントの処理
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
    // 入力値を即時に反映
    console.log("入力イベント（即時）:", {
      入力値: value,
      現在のタイトル: newSchedule.title,
      サジェスト表示: showSuggestions,
    });

    setNewSchedule((prev) => ({
      ...prev,
      title: value,
    }));
    // 検索処理用の値を更新（デバウンス処理される）
    setSearchTerm(value);
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

  // テスト用のメソッド
  const handleLocationChange = (location: string) => {
    setNewSchedule((prev) => ({
      ...prev,
      location,
    }));
  };

  // プラン保存のハンドラーを追加
  const handleSavePlan = () => {
    if (!planTitle || scheduleItems.length === 0) return;

    // スケジュールの日付を取得して開始日と終了日を決定
    const dates = scheduleItems.map((item) => new Date(item.date).getTime());
    const startDate = format(new Date(Math.min(...dates)), "yyyy-MM-dd");
    const endDate = format(new Date(Math.max(...dates)), "yyyy-MM-dd");

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

  const handleScheduleChange = (field: string, value: string) => {
    setNewSchedule((prev) => ({
      ...prev,
      [field]: value,
    }));
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
                <MapSection />
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

                  <AddScheduleForm
                    newSchedule={newSchedule}
                    onSubmit={handleSubmit}
                    onScheduleChange={handleScheduleChange}
                    onTitleChange={handleTitleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() =>
                      setShowSuggestions(newSchedule.title.length > 0)
                    }
                    onBlur={handleBlur}
                    showSuggestions={showSuggestions}
                    suggestions={suggestions}
                    selectedIndex={selectedIndex}
                    onSelectSpot={handleSelectSpot}
                    onMouseEnter={setSelectedIndex}
                  />

                  <ScheduleList
                    scheduleItems={scheduleItems}
                    editingId={editingId}
                    editingItem={editingItem}
                    handleEdit={handleEdit}
                    handleCancelEdit={handleCancelEdit}
                    handleSaveEdit={handleSaveEdit}
                    handleDelete={handleDelete}
                    setEditingItem={setEditingItem}
                    moveItem={moveItem}
                    newItemId={newItemId}
                  />

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
};
