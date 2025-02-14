import { useState } from "react";
import { format } from "date-fns";
import { type ScheduleItem } from "../components/DraggableScheduleItem";
import {
  type SavedPlan,
  createPlanAddedEvent,
  PLANS_STORAGE_KEY,
} from "@/components/saved-plans";

export const usePlanSaving = () => {
  const [planTitle, setPlanTitle] = useState("");

  // 保存済みプランを読み込む
  const loadSavedPlans = (): SavedPlan[] => {
    if (typeof window === "undefined") return [];
    const savedPlans = localStorage.getItem(PLANS_STORAGE_KEY);
    return savedPlans ? JSON.parse(savedPlans) : [];
  };

  // 保存済みプランを保存
  const savePlans = (plans: SavedPlan[]) => {
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
  };

  // 編集用のプランを読み込む
  const loadPlanForEdit = (planId: number): SavedPlan | undefined => {
    const savedPlans = loadSavedPlans();
    return savedPlans.find((plan) => plan.id === planId);
  };

  const handleSavePlan = (
    scheduleItems: ScheduleItem[],
    editPlanId?: number
  ) => {
    if (!planTitle || scheduleItems.length === 0) return;

    const dates = scheduleItems.map((item) => new Date(item.date).getTime());
    const startDate = format(new Date(Math.min(...dates)), "yyyy-MM-dd");
    const endDate = format(new Date(Math.max(...dates)), "yyyy-MM-dd");

    const firstSchedule = scheduleItems[0];

    // スケジュールの配列を新しい形式に変換
    const schedules = scheduleItems.map((item, index) => ({
      id: index + 1,
      title: item.title,
      date: item.date,
      startTime: item.time,
      endTime: format(
        new Date(`${item.date} ${item.time}`).getTime() + 2 * 60 * 60 * 1000,
        "HH:mm"
      ), // デフォルトで2時間後を終了時間とする
      location: item.location,
      prefectureCode: item.prefectureCode || "13", // デフォルトは東京
    }));

    const newPlan: SavedPlan = {
      id: editPlanId || Date.now(),
      title: planTitle,
      startDate,
      endDate,
      location: firstSchedule.location.split("（")[0],
      image: firstSchedule.image,
      scheduleCount: scheduleItems.length,
      schedules,
    };

    // 保存済みプランを更新
    const savedPlans = loadSavedPlans();
    const updatedPlans = editPlanId
      ? savedPlans.map((plan) => (plan.id === editPlanId ? newPlan : plan))
      : [...savedPlans, newPlan];

    // 保存とイベント発火
    savePlans(updatedPlans);
    window.dispatchEvent(createPlanAddedEvent(newPlan));

    setPlanTitle("");
    return true;
  };

  return {
    planTitle,
    setPlanTitle,
    handleSavePlan,
    loadPlanForEdit,
  };
};
