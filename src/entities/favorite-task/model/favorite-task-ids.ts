const toTaskId = (taskId: string | number): string => String(taskId);

export const normalizeFavoriteTaskIds = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];

  const ids = value.filter(
    (item): item is string | number => typeof item === "string" || typeof item === "number"
  );

  return Array.from(new Set(ids.map(toTaskId)));
};

export const addFavoriteTaskId = (
  favoriteTaskIds: readonly string[],
  taskId: string | number
): string[] => {
  const normalizedTaskId = toTaskId(taskId);
  return favoriteTaskIds.includes(normalizedTaskId)
    ? [...favoriteTaskIds]
    : [...favoriteTaskIds, normalizedTaskId];
};

export const removeFavoriteTaskId = (
  favoriteTaskIds: readonly string[],
  taskId: string | number
): string[] => {
  const normalizedTaskId = toTaskId(taskId);
  return favoriteTaskIds.filter((id) => id !== normalizedTaskId);
};

export const toggleFavoriteTaskId = (
  favoriteTaskIds: readonly string[],
  taskId: string | number
): string[] => {
  const normalizedTaskId = toTaskId(taskId);
  return favoriteTaskIds.includes(normalizedTaskId)
    ? removeFavoriteTaskId(favoriteTaskIds, normalizedTaskId)
    : addFavoriteTaskId(favoriteTaskIds, normalizedTaskId);
};
