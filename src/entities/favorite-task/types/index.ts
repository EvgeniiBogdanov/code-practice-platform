export interface FavoriteTaskState {
  favoriteTaskIds: string[];
  addFavoriteTask: (taskId: string | number) => void;
  removeFavoriteTask: (taskId: string | number) => void;
  toggleFavoriteTask: (taskId: string | number) => void;
}
