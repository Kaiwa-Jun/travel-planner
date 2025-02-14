import type { ScheduleItem } from "@/types/schedule";

export const useScheduleSorting = () => {
  // 日付と時間でソートする関数
  const sortByDateTime = (a: ScheduleItem, b: ScheduleItem) => {
    const dateTimeA = new Date(`${a.date} ${a.time}`);
    const dateTimeB = new Date(`${b.date} ${b.time}`);
    return dateTimeA.getTime() - dateTimeB.getTime();
  };

  // 時間を再割り当てする関数
  const reassignTimes = (items: ScheduleItem[]) => {
    // 日付ごとにグループ化
    const groupedByDate = items.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = [];
      }
      acc[item.date].push(item);
      return acc;
    }, {} as Record<string, ScheduleItem[]>);

    // 各日付グループ内で時間を再割り当て
    const result: ScheduleItem[] = [];
    Object.entries(groupedByDate).forEach(([date, dateItems]) => {
      const times = dateItems
        .map((item) => item.time)
        .sort((a, b) => {
          const timeA = new Date(`1970/01/01 ${a}`);
          const timeB = new Date(`1970/01/01 ${b}`);
          return timeA.getTime() - timeB.getTime();
        });

      dateItems.forEach((item, index) => {
        result.push({
          ...item,
          time: times[index],
        });
      });
    });

    return result.sort(sortByDateTime);
  };

  return {
    sortByDateTime,
    reassignTimes,
  };
};
