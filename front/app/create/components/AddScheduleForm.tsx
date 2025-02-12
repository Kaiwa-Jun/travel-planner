"use client";

import { Calendar, Clock, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type Spot } from "@/data/spots";

interface AddScheduleFormProps {
  newSchedule: {
    date: string;
    time: string;
    title: string;
    location: string;
  };
  onSubmit: (e: React.FormEvent) => void;
  onScheduleChange: (field: string, value: string) => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  showSuggestions: boolean;
  suggestions: Spot[];
  selectedIndex: number;
  onSelectSpot: (spot: Spot) => void;
  onMouseEnter: (index: number) => void;
}

export const AddScheduleForm = ({
  newSchedule,
  onSubmit,
  onScheduleChange,
  onTitleChange,
  onKeyDown,
  onFocus,
  onBlur,
  showSuggestions,
  suggestions,
  selectedIndex,
  onSelectSpot,
  onMouseEnter,
}: AddScheduleFormProps) => {
  return (
    <form onSubmit={onSubmit} className="mb-4 pb-4 border-b">
      <div className="space-y-2 md:space-y-3">
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={newSchedule.date}
            onChange={(e) => onScheduleChange("date", e.target.value)}
            className="max-w-[160px]"
            required
            data-testid="date-input"
          />
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <Input
            type="time"
            value={newSchedule.time}
            onChange={(e) => onScheduleChange("time", e.target.value)}
            placeholder="時間"
            className="max-w-[120px]"
            required
            data-testid="time-input"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4" />
          <div className="relative w-full">
            <Input
              value={newSchedule.title}
              onChange={onTitleChange}
              onKeyDown={onKeyDown}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="スポット名"
              required
            />
            {showSuggestions && (
              <div
                className="absolute left-0 right-0 mt-1 bg-background border rounded-md shadow-lg"
                style={{ zIndex: 9999 }}
              >
                <div className="max-h-[400px] overflow-y-auto">
                  {suggestions.map((spot, index) => (
                    <button
                      key={spot.id}
                      className={`w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2 ${
                        index === selectedIndex ? "bg-muted" : ""
                      }`}
                      onClick={() => onSelectSpot(spot)}
                      type="button"
                      onMouseEnter={() => onMouseEnter(index)}
                      onMouseDown={(e) => e.preventDefault()}
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
                  {suggestions.length === 0 && newSchedule.title.length > 0 && (
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      該当するスポットが見つかりません
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={
            !newSchedule.date ||
            !newSchedule.time ||
            !newSchedule.title ||
            !newSchedule.location
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          スケジュールを追加
        </Button>
      </div>
    </form>
  );
};
