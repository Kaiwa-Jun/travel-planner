import { useState } from "react";
import { format } from "date-fns";
import { type ScheduleItem } from "../components/DraggableScheduleItem";
import { type SavedPlan, createPlanAddedEvent } from "@/components/saved-plans";

export const usePlanSaving = () => {
  const [planTitle, setPlanTitle] = useState("");

  const handleSavePlan = (scheduleItems: ScheduleItem[]) => {
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
    }));

    const newPlan: SavedPlan = {
      id: Date.now(),
      title: planTitle,
      startDate,
      endDate,
      location: firstSchedule.location.split("（")[0],
      image: firstSchedule.image,
      scheduleCount: scheduleItems.length,
      schedules,
    };

    const event = createPlanAddedEvent(newPlan);
    window.dispatchEvent(event);

    setPlanTitle("");
    return true;
  };

  return {
    planTitle,
    setPlanTitle,
    handleSavePlan,
  };
};
