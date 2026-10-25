import React from "react";
import { Home, Brain, Network } from "lucide-react";
import { JavaScriptIcon, TypeScriptIcon, ReactIcon } from "@/shared/ui";
import { CURRICULUM_COUNTS, DESIGN_CASE_COUNT } from "./curriculumManifest";
import { SectionType } from "../types";

const RU_PLURAL_RULES = new Intl.PluralRules("ru-RU");

const CASE_WORD: Record<Intl.LDMLPluralRule, string> = {
  zero: "кейсов",
  one: "кейс",
  two: "кейса",
  few: "кейса",
  many: "кейсов",
  other: "кейса",
};

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
  typescript: {
    id: "typescript",
    title: "TypeScript",
    label: "TypeScript",
    path: "/typescript",
    icon: TypeScriptIcon,
    color: "var(--color-ts)",
    badge: `${CURRICULUM_COUNTS.typescript} задачи`,
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
  "system-design": {
    id: "system-design",
    title: "Системный дизайн",
    label: "Системный дизайн",
    path: "/system-design",
    icon: Network,
    color: "var(--color-sd)",
    badge: `${DESIGN_CASE_COUNT} ${CASE_WORD[RU_PLURAL_RULES.select(DESIGN_CASE_COUNT)]}`,
  },
};

export const SECTIONS_LIST: SectionMeta[] = [
  SECTIONS_CONFIG.home,
  SECTIONS_CONFIG.javascript,
  SECTIONS_CONFIG.typescript,
  SECTIONS_CONFIG.react,
  SECTIONS_CONFIG.algorithms,
  SECTIONS_CONFIG["system-design"],
];
