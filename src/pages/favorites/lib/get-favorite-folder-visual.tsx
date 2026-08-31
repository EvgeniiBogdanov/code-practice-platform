import React from "react";
import { Folder } from "lucide-react";
import {
  SECTIONS_CONFIG,
  SectionType,
} from "@/entities/task";
import { getAlgoGroupMeta, getGroupMeta, REACT_GROUPS_CONFIG } from "@/entities/task/groups";

export interface FavoriteFolderVisual {
  color: string;
  icon: React.ReactNode;
  routeId: string;
}

export const getFavoriteFolderVisual = (
  section: SectionType,
  folderTitle: string,
  size = 17
): FavoriteFolderVisual => {
  if (section === "javascript") {
    const meta = getGroupMeta(folderTitle);
    return { color: meta.color, icon: meta.renderIcon(size), routeId: `group-${folderTitle}` };
  }

  if (section === "algorithms") {
    const meta = getAlgoGroupMeta(folderTitle);
    return { color: meta.color, icon: meta.renderIcon(size), routeId: meta.infoId };
  }

  const reactEntry = Object.entries(REACT_GROUPS_CONFIG).find(
    ([, meta]) => meta.name === folderTitle
  );
  const reactMeta = reactEntry?.[1];
  const color = reactMeta?.color ?? SECTIONS_CONFIG.react.color;
  const Icon = reactMeta?.icon ?? Folder;

  return {
    color,
    icon: <Icon size={size} color={color} />,
    routeId: reactEntry?.[0] ?? "group-warmup",
  };
};
