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

    const newPlan: SavedPlan = {
      id: Date.now(),
      title: planTitle,
      startDate,
      endDate,
      location: firstSchedule.location.split("（")[0],
      image: firstSchedule.image,
      scheduleCount: scheduleItems.length,
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
