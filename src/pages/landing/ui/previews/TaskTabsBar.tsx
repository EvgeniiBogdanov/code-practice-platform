import React from "react";
import { BookOpen, CheckCircle, HelpCircle, ListChecks, Play } from "lucide-react";
import { Tabs, type TabItem } from "@/shared/ui";
import styles from "./TaskTabsBar.module.css";

const TASK_TABS: TabItem[] = [
  { id: "candidate", label: "Задача", icon: <Play size={13} /> },
  { id: "solution", label: "Решение", icon: <CheckCircle size={13} /> },
  { id: "materials", label: "Разбор", icon: <BookOpen size={13} /> },
  { id: "questions", label: "Вопросы", icon: <HelpCircle size={13} />, badge: 1 },
  { id: "checklist", label: "Проверка", icon: <ListChecks size={13} />, badge: 3 },
];

const noop = (): void => {};

export interface TaskTabsBarProps {
  activeId: "candidate" | "solution";
}

/** The real task-page tabs (with their per-tab accent underline) in a read-only state. */
export const TaskTabsBar = ({ activeId }: TaskTabsBarProps): React.JSX.Element => (
  <Tabs
    size="sm"
    className={styles.tabs}
    items={TASK_TABS}
    activeId={activeId}
    onChange={noop}
    ariaLabel="Вкладки задачи"
  />
);
