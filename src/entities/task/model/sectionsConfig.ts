import React from "react";
import { Home, Brain } from "lucide-react";
import { JavaScriptIcon, ReactIcon } from "@/shared/ui";
import { CURRICULUM_COUNTS } from "./curriculum-manifest";
import { SectionType } from "../types";

export interface SectionMeta {
  id: "home" | SectionType;
  title: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number | string; className?: string; color?: string }>;
  color: string;
  badge: string;
}

export const SECTIONS_CONFIG: Record<"home" | SectionType, SectionMeta> = {
  home: {
    id: "home",
    title: "Главная",
    label: "Обзор платформы",
    path: "/home",
    icon: Home,
    color: "var(--color-home)",
    badge: "Обзор",
  },
  javascript: {
    id: "javascript",
    title: "JavaScript",
    label: "JavaScript",
    path: "/javascript",
    icon: JavaScriptIcon,
    color: "var(--color-js)",
    badge: `${CURRICULUM_COUNTS.javascript} задач`,
  },
  react: {
    id: "react",
    title: "React",
    label: "React",
    path: "/react",
    icon: ReactIcon,
    color: "var(--color-react)",
    badge: `${CURRICULUM_COUNTS.react} задач`,
  },
  algorithms: {
    id: "algorithms",
    title: "Алгоритмы",
    label: "Алгоритмы",
    path: "/algorithms",
    icon: Brain,
    color: "var(--color-algo)",
    badge: `${CURRICULUM_COUNTS.algorithms} задач`,
  },
};

export const SECTIONS_LIST: SectionMeta[] = [
  SECTIONS_CONFIG.home,
  SECTIONS_CONFIG.javascript,
  SECTIONS_CONFIG.react,
  SECTIONS_CONFIG.algorithms,
];
