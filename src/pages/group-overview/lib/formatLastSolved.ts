export const formatLastSolved = (timestamp?: number | string | null): string | null => {
  if (!timestamp) return null;
  const numTime = typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp;
  if (!numTime || isNaN(numTime)) return null;

  const d = new Date(numTime);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return "Сегодня";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Вчера";
  const months = [
    "янв",
    "фев",
    "мар",
    "апр",
    "мая",
    "июн",
    "июл",
    "авг",
    "сен",
    "окт",
    "ноя",
    "дек",
  ];
  return `${d.getDate()} ${months[d.getMonth()]}`;
};
