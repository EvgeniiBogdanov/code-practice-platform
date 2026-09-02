export function getStartOfCalendarDay(dateInput: Date | number = new Date()): Date {
  const d = typeof dateInput === "number" ? new Date(dateInput) : new Date(dateInput.getTime());
  if (!d || isNaN(d.getTime())) return new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getDaysElapsed(fromTimestamp?: number): number {
  if (!fromTimestamp || isNaN(fromTimestamp)) return 0;
  const todayStart = getStartOfCalendarDay().getTime();
  const fromDateStart = getStartOfCalendarDay(fromTimestamp).getTime();
  const diffMs = todayStart - fromDateStart;
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export function getOverdueDays(dueDate?: string, nextReviewAt?: number): number {
  const todayStart = getStartOfCalendarDay().getTime();

  if (dueDate) {
    const parts = dueDate.split("-").map(Number);
    if (parts.length === 3 && !parts.some(isNaN)) {
      const targetDate = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
      const targetStart = targetDate.getTime();
      return Math.floor((todayStart - targetStart) / (1000 * 60 * 60 * 24));
    }
  }

  if (nextReviewAt && !isNaN(nextReviewAt)) {
    const targetStart = getStartOfCalendarDay(nextReviewAt).getTime();
    return Math.floor((todayStart - targetStart) / (1000 * 60 * 60 * 24));
  }

  return 0;
}

export function getMessageIndex(
  seedSource: (string | number | undefined)[],
  arrayLength: number
): number {
  if (arrayLength <= 0) return 0;
  const seedString = seedSource.filter(Boolean).join(":");
  if (!seedString) return 0;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash * 31 + seedString.charCodeAt(i)) >>> 0;
  }
  return hash % arrayLength;
}
