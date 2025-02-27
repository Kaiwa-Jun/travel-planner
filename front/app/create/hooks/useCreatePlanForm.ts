import { useState } from "react";
import { format } from "date-fns";
import { type ScheduleItem } from "@/types/schedule";
import { type Spot } from "@/data/spots";
import { usePlacesAutocomplete } from "./usePlacesAutocomplete";
import { useScheduleSorting } from "./useScheduleSorting";

// 住所から「日本、」を削除する関数
const formatLocation = (location: string): string => {
  return location.replace(/^日本、/, "");
};

// 都道府県名から都道府県コードを取得する関数
const getPrefectureCode = (location: string): string => {
  // 都道府県名と都道府県コードのマッピング
  const prefectureMap: { [key: string]: string } = {
    北海道: "1",
    青森: "2",
    岩手: "3",
    宮城: "4",
    秋田: "5",
    山形: "6",
    福島: "7",
    茨城: "8",
    栃木: "9",
    群馬: "10",
    埼玉: "11",
    千葉: "12",
    東京: "13",
    神奈川: "14",
    新潟: "15",
    富山: "16",
    石川: "17",
    福井: "18",
    山梨: "19",
    長野: "20",
    岐阜: "21",
    静岡: "22",
    愛知: "23",
    三重: "24",
    滋賀: "25",
    京都: "26",
    大阪: "27",
    兵庫: "28",
    奈良: "29",
    和歌山: "30",
    鳥取: "31",
    島根: "32",
    岡山: "33",
    広島: "34",
    山口: "35",
    徳島: "36",
    香川: "37",
    愛媛: "38",
    高知: "39",
    福岡: "40",
    佐賀: "41",
    長崎: "42",
    熊本: "43",
    大分: "44",
    宮崎: "45",
    鹿児島: "46",
    沖縄: "47",
  };

  // 住所から都道府県名を抽出
  for (const [name, code] of Object.entries(prefectureMap)) {
    if (location.includes(name)) {
      return code;
    }
  }

  return "13"; // デフォルトは東京
};

export const useCreatePlanForm = () => {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [newSchedule, setNewSchedule] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    time: "",
    title: "",
    location: "",
  });
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
      location: formatLocation(newSchedule.location),
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=80",
      prefectureCode: getPrefectureCode(newSchedule.location),
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
    }, 300);
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("入力イベント（即時）:", {
      入力値: value,
      現在のタイトル: newSchedule.title,
      サジェスト表示: showSuggestions,
    });

    setNewSchedule((prev) => ({
      ...prev,
      title: value,
      location: "",
    }));
    setSearchTerm(value);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  const handleSelectSpot = (spot: Spot) => {
    setNewSchedule({
      ...newSchedule,
      title: spot.name,
      location: formatLocation(spot.location || "場所未設定"),
    });
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleScheduleChange = (field: string, value: string) => {
    setNewSchedule((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
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
  };
};
