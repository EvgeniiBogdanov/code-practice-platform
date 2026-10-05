import { getLocalDateString } from "@/entities/review";

export const ACTIVITY_DAYS = 365;
export const ACTIVITY_WEEKS = 53;
export const MAX_ACTIVITY_LEVEL = 4;

export type ActivityLevel = 0 | 1 | 2 | 3 | 4;

export interface ActivityCell {
  date: string;
  count: number;
  level: ActivityLevel;
}

export interface ActivityWeek {
  /** Always 7 items, Monday first. `null` — день вне диапазона (выравнивание сетки). */
  days: readonly (ActivityCell | null)[];
  monthLabel: string | null;
}

export interface ActivityGrid {
  weeks: readonly ActivityWeek[];
  total: number;
}

const monthFormatter = new Intl.DateTimeFormat("ru-RU", { month: "short" });

const toLevel = (count: number): ActivityLevel =>
  Math.min(Math.max(count, 0), MAX_ACTIVITY_LEVEL) as ActivityLevel;

const getMondayIndex = (date: Date): number => (date.getDay() + 6) % 7;

const formatMonth = (date: Date): string => monthFormatter.format(date).replace(".", "");

export const getActivityRange = (endTimestamp: number): { from: string; to: string } => {
  const endDate = new Date(endTimestamp);
  const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  startDate.setDate(startDate.getDate() - (ACTIVITY_DAYS - 1));
  return { from: getLocalDateString(startDate), to: getLocalDateString(endDate) };
};

export const buildActivityGrid = (
  activityByDate: Readonly<Record<string, number>>,
  endTimestamp: number
): ActivityGrid => {
  const { from } = getActivityRange(endTimestamp);
  const cursor = new Date(`${from}T00:00:00`);
  const slots: (ActivityCell | null)[] = Array.from({ length: getMondayIndex(cursor) }, () => null);
  const firstDayOfWeek: Date[] = [];
  let total = 0;

  for (let index = 0; index < ACTIVITY_DAYS; index++) {
    const date = getLocalDateString(cursor);
    const count = activityByDate[date] ?? 0;
    if (index === 0 || slots.length % 7 === 0) firstDayOfWeek.push(new Date(cursor));
    slots.push({ date, count, level: toLevel(count) });
    total += count;
    cursor.setDate(cursor.getDate() + 1);
  }

  while (slots.length < ACTIVITY_WEEKS * 7) slots.push(null);

  const weeks = firstDayOfWeek.map<ActivityWeek>((weekStart, weekIndex) => {
    const previous = firstDayOfWeek[weekIndex - 1];
    const isMonthStart = !previous || previous.getMonth() !== weekStart.getMonth();
    return {
      days: slots.slice(weekIndex * 7, weekIndex * 7 + 7),
      monthLabel: isMonthStart ? formatMonth(weekStart) : null,
    };
  });

  // Подпись над единственной колонкой неполного месяца (в начале и в конце) не помещается.
  if (weeks[1]?.monthLabel) weeks[0] = { ...weeks[0], monthLabel: null };
  const lastIndex = weeks.length - 1;
  weeks[lastIndex] = { ...weeks[lastIndex], monthLabel: null };

  return { weeks, total };
};
