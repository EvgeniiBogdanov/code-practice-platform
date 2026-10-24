import React from "react";
import { Folder } from "lucide-react";
import {
  REACT_GROUPS_CONFIG,
  SECTIONS_CONFIG,
  getAlgoGroupMeta,
  getScriptGroupMeta,
} from "@/entities/task";
import { getSkillTasks, type SkillDefinition } from "@/entities/skill";

export interface SkillVisual {
  color: string;
  icon: React.ReactNode;
}

const isReactGroupId = (key: string): key is keyof typeof REACT_GROUPS_CONFIG =>
  key in REACT_GROUPS_CONFIG;

/**
 * The icon and colour of the curriculum group a skill starts in: the ones the sidebar and the
 * favorites show for that group. The group is that of the skill's first task in route order.
 */
export const getSkillVisual = (skill: SkillDefinition, size = 14): SkillVisual => {
  const groupKey = getSkillTasks(skill.id)[0]?.group ?? null;
  if (groupKey !== null) {
    if (skill.section === "javascript" || skill.section === "typescript") {
      const meta = getScriptGroupMeta(groupKey, skill.section);
      return { color: meta.color, icon: meta.renderIcon(size) };
    }
    if (skill.section === "algorithms") {
      const meta = getAlgoGroupMeta(groupKey);
      return { color: meta.color, icon: meta.renderIcon(size) };
    }
    if (isReactGroupId(groupKey)) {
      const meta = REACT_GROUPS_CONFIG[groupKey];
      const Icon = meta.icon;
      return { color: meta.color, icon: <Icon size={size} color={meta.color} /> };
    }
  }

  const { color } = SECTIONS_CONFIG[skill.section];
  return { color, icon: <Folder size={size} color={color} /> };
};
