import React from "react";

export type SectionType = "react" | "javascript" | "algorithms";

export type TaskDifficulty =
  "warm-up" | "refactoring" | "middle" | "strong" | "ts" | "easy" | "medium" | "hard";

export interface TaskFile {
  name: string;
  code: string;
  filepath?: string;
  solution?: string;
  rawSolution?: string;
  candidateCode?: string;
  solutionCode?: string;
}

export interface TaskSolution {
  title: string;
  name?: string;
  isRecommended?: boolean;
  badge?: string;
  recommendationNote?: string;
  rawSolution?: string;
  filepath?: string;
  code?: string;
  files?: TaskFile[];
  solution?: React.ComponentType | string;
}

export type TaskVariant = TaskSolution;

export interface TaskQuestion {
  question: string;
  answer: string;
  title?: string;
  desc?: string;
  response?: string;
}

export interface Task {
  id: string | number;
  title: string;
  desc?: string;
  category?: string;
  difficulty?: TaskDifficulty;
  section: SectionType;
  group?: string;
  subgroup?: string;
  tags?: string[];
  files?: TaskFile[];
  candidate?: React.ComponentType | string;
  solution?: React.ComponentType | string;
  rawCandidate?: string;
  rawSolution?: string;
  solutions?: TaskSolution[];
  variants?: TaskSolution[];
  materials?: string[];
  checklist?: string[];
  questions?: TaskQuestion[];
  interviewerQuestions?: TaskQuestion[];
  explanation?: string;
  isMultiFile?: boolean;
  isGroupOverview?: boolean;
  recommendationNote?: string;
  isRecommended?: boolean;
  badge?: string;
  filepath?: string;
  template?: string;
  code?: string;
  isRaw?: boolean;
}

export interface TaskGroup {
  id: string;
  title: string;
  tasks: Task[];
  section: SectionType;
}
