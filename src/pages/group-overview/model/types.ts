import React from "react";
import { Task, SectionType } from "@/entities/task";

export type StatusFilter = "all" | "completed" | "uncompleted";
export type ViewMode = "list" | "cards";

export interface PracticeTaskItem {
  id?: string;
  title: string;
  desc: string;
  url?: string;
  isInternal?: boolean;
}

export interface ArticleLinkItem {
  title: string;
  urlTitle?: string;
  url: string;
}

export interface GroupMetaInfo {
  name: string;
  title: string;
  desc?: string;
  guideTitle?: string;
  iconEmoji?: string;
  icon?: React.ComponentType<{ size?: number | string; className?: string; color?: string }>;
  renderIcon?: (size?: number, extraStyle?: Record<string, unknown>) => React.ReactNode;
  color?: string;
  bg?: string;
  infoId?: string;
  infoRaw?: string;
  practiceTasksList?: PracticeTaskItem[];
  articleLinksList?: ArticleLinkItem[];
}

export interface GroupOverviewState {
  groupMeta: GroupMetaInfo;
  groupTasks: Task[];
  filteredTasks: Task[];
  groupedSubgroups: Record<string, Task[]>;
  hasSubgroups: boolean;
  section: SectionType;
  taskRoute: string;
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isSubgroupOpen: (subName: string) => boolean;
  toggleSubgroup: (subName: string) => void;
  stats: {
    total: number;
    completed: number;
    remaining: number;
    percent: number;
  };
  readingTimeMinutes: number;
  firstTask: Task | undefined;
  practiceTasksList: PracticeTaskItem[];
  articleLinksList: ArticleLinkItem[];
  getTaskStatus: (taskId: string | number) => "solved" | "unsolved" | "unstarted";
  getTaskGradientClass: (
    task: Task,
    status: "solved" | "unsolved" | "unstarted",
    taskReview: unknown
  ) => string;
  getTaskTooltipTitle: (
    task: Task,
    status: "solved" | "unsolved" | "unstarted",
    taskReview: unknown
  ) => string;
  formatLastSolved: (timestamp?: number | string | null) => string | null;
  formatNextReviewDate: (timestamp?: any, dueDate?: any) => string | null;
  isTaskDue: (review: any) => boolean;
  reviews: Record<string, any>;
  completedTasks: Record<string, any>;
}
