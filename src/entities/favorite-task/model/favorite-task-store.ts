import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { FavoriteTaskState } from "../types";
import {
  addFavoriteTaskId,
  normalizeFavoriteTaskIds,
  removeFavoriteTaskId,
  toggleFavoriteTaskId,
} from "./favorite-task-ids";

export const useFavoriteTaskStore = create<FavoriteTaskState>()(
  persist(
    (set) => ({
      favoriteTaskIds: [],
      addFavoriteTask: (taskId): void => {
        set((state) => ({
          favoriteTaskIds: addFavoriteTaskId(state.favoriteTaskIds, taskId),
        }));
      },
      removeFavoriteTask: (taskId): void => {
        set((state) => ({
          favoriteTaskIds: removeFavoriteTaskId(state.favoriteTaskIds, taskId),
        }));
      },
      toggleFavoriteTask: (taskId): void => {
        set((state) => ({
          favoriteTaskIds: toggleFavoriteTaskId(state.favoriteTaskIds, taskId),
        }));
      },
    }),
    {
      name: "playground_favorite_tasks",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ favoriteTaskIds: state.favoriteTaskIds }),
      merge: (persistedState, currentState) => {
        const persisted =
          typeof persistedState === "object" && persistedState !== null
            ? (persistedState as Partial<FavoriteTaskState>)
            : {};
        return {
          ...currentState,
          favoriteTaskIds: normalizeFavoriteTaskIds(persisted.favoriteTaskIds),
        };
      },
    }
  )
);
