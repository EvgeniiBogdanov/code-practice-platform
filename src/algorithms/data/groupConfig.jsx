import React from "react";
import { GitMerge, Folder } from "lucide-react";
import TwoPointersInfoRaw from "../explanations/1_two_pointers/_info.md?raw";

export const ALGO_GROUP_CONFIG = {
  "Two Pointers": {
    name: "Two Pointers",
    title: "Two Pointers",
    iconEmoji: "🔀",
    icon: GitMerge,
    color: "#ec4899", // Pink
    bg: "rgba(236, 72, 153, 0.12)",
    infoId: "group-two-pointers",
    infoRaw: TwoPointersInfoRaw,
    desc: "Полное руководство по алгоритмической технике двух указателей: теория, примеры, трассировки и готовые шаблоны для собеседований.",
  },
};

export const getAlgoGroupMeta = (groupName) => {
  const meta = ALGO_GROUP_CONFIG[groupName] || {
    name: groupName || "Algorithms",
    title: groupName || "Algorithms",
    iconEmoji: "🧠",
    icon: Folder,
    color: "#a855f7",
    bg: "rgba(168, 85, 247, 0.12)",
    infoId: `group-${String(groupName || "algo").toLowerCase().replace(/\s+/g, "-")}`,
    infoRaw: "",
    desc: "",
  };
  const IconComponent = meta.icon;

  return {
    ...meta,
    renderIcon: (size = 14, extraStyle = {}) => (
      <IconComponent size={size} style={{ color: meta.color, flexShrink: 0, ...extraStyle }} />
    ),
  };
};

export const getAlgoGroupMetaByInfoId = (infoId) => {
  if (!infoId) return null;
  const entry = Object.values(ALGO_GROUP_CONFIG).find(
    (g) => g.infoId === infoId || infoId === `group-${g.name.toLowerCase().replace(/\s+/g, "-")}`
  );
  if (entry) return getAlgoGroupMeta(entry.name);
  return null;
};

export default getAlgoGroupMeta;
