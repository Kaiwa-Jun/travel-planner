"use client";

import { Navigation } from "@/components/navigation";
import { SavedPlans, PLAN_EDIT_EVENT } from "@/components/saved-plans";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { MapSection } from "./MapSection";
import { AddScheduleForm } from "./AddScheduleForm";
import { ScheduleList } from "./ScheduleList";
import { useCreatePlanForm } from "../hooks/useCreatePlanForm";
import { usePlanSaving } from "../hooks/usePlanSaving";
import { useEffect, useState } from "react";
import type { SavedPlan } from "@/components/saved-plans";

export const CreatePlanPageContent = () => {
  const [editingPlan, setEditingPlan] = useState<SavedPlan | null>(null);

  const {
    scheduleItems,
    setScheduleItems,
    editingId,
    editingItem,
    newSchedule,
    newItemId,
    suggestions,
    showSuggestions,
    selectedIndex,
    handleEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleDelete,
    handleSubmit,
    moveItem,
    handleKeyDown,
    handleTitleChange,
    handleBlur,
    handleSelectSpot,
    handleScheduleChange,
    setShowSuggestions,
    setSelectedIndex,
    setEditingItem,
  } = useCreatePlanForm();

  const { planTitle, setPlanTitle, handleSavePlan } = usePlanSaving();

  // プラン編集イベントのリスナーを設定
  useEffect(() => {
    const handlePlanEdit = (event: CustomEvent<SavedPlan>) => {
      const plan = event.detail;
      setEditingPlan(plan);
      setPlanTitle(plan.title);

      // スケジュールデータを変換して設定
      const convertedSchedules = plan.schedules.map((schedule) => ({
        id: schedule.id,
        date: schedule.date,
        time: schedule.startTime,
        title: schedule.title,
        location: schedule.location,
        image: plan.image,
      }));
      setScheduleItems(convertedSchedules);
    };

    window.addEventListener(PLAN_EDIT_EVENT, handlePlanEdit as EventListener);
    return () => {
      window.removeEventListener(
        PLAN_EDIT_EVENT,
        handlePlanEdit as EventListener
      );
    };
  }, [setPlanTitle, setScheduleItems]);

  const onSavePlan = () => {
    if (handleSavePlan(scheduleItems, editingPlan?.id)) {
      setScheduleItems([]);
      setEditingPlan(null);
    }
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
              <h1 className="text-3xl font-bold">
                {editingPlan ? "プラン編集" : "プラン作成"}
              </h1>
            </div>

            <div className="flex flex-col md:grid md:grid-cols-[1fr,400px] gap-4 md:gap-8">
              <div className="space-y-8">
                <MapSection />
                <div className="md:block hidden">
                  <SavedPlans />
                </div>
              </div>

              <Card className="w-full h-fit order-2 md:order-none">
                <CardContent className="p-4 md:p-6 flex flex-col h-[calc(100vh-200px)] md:h-[calc(100vh-200px)] overflow-hidden">
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
                      onClick={onSavePlan}
                      disabled={!planTitle || scheduleItems.length === 0}
                      className="w-full"
                    >
                      {editingPlan ? "プランを更新" : "プランを保存"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="order-3 md:hidden">
                <SavedPlans />
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </DndProvider>
  );
};
