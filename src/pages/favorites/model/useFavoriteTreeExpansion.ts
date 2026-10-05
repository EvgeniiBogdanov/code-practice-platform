import { useCallback, useState, type SetStateAction } from "react";
import type { SectionType } from "@/entities/task";

type CollapsedNodes = Record<string, boolean>;

const getStorageKey = (section: SectionType): string => `playground_collapsed_favorites_${section}`;

const readCollapsedNodes = (storageKey: string): CollapsedNodes => {
  if (typeof window === "undefined") return {};

  try {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return {};

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, boolean] => typeof entry[1] === "boolean"
      )
    );
  } catch {
    return {};
  }
};

export interface FavoriteTreeExpansionState {
  isExpanded: (key: string) => boolean;
  toggleNode: (key: string) => void;
}

export const useFavoriteTreeExpansion = (section: SectionType): FavoriteTreeExpansionState => {
  const storageKey = getStorageKey(section);
  const [collapsedNodes, setCollapsedNodesState] = useState<CollapsedNodes>(() =>
    readCollapsedNodes(storageKey)
  );

  const setCollapsedNodes = useCallback(
    (updater: SetStateAction<CollapsedNodes>): void => {
      setCollapsedNodesState((previous) => {
        const next = typeof updater === "function" ? updater(previous) : updater;
        try {
          sessionStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // The current session state still applies if storage is unavailable.
        }
        return next;
      });
    },
    [storageKey]
  );

  const isExpanded = useCallback((key: string): boolean => !collapsedNodes[key], [collapsedNodes]);

  const toggleNode = useCallback(
    (key: string): void => {
      setCollapsedNodes((previous) => ({ ...previous, [key]: !previous[key] }));
    },
    [setCollapsedNodes]
  );

  return { isExpanded, toggleNode };
};
