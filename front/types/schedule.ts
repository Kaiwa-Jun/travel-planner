export interface ScheduleItem {
  id: number;
  date: string;
  time: string;
  title: string;
  location: string;
  image: string;
  prefectureCode?: string;
}

export interface Schedule {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  memo?: string;
  prefectureCode: string;
}

export interface SavedPlan {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  image: string;
  scheduleCount: number;
  schedules: Schedule[];
}
