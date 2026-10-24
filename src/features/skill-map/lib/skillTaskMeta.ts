import {
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleSlash,
  CircleX,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SkillTaskProgress, SkillTaskState, SkillTone } from "@/entities/skill";
import { getTaskSectionById } from "@/entities/task/meta";

export const SKILL_TASK_ICONS: Readonly<Record<SkillTaskState, LucideIcon>> = {
  new: CircleDashed,
  unsolved: CircleX,
  hard: CircleAlert,
  overdue: Clock,
  learning: CircleDot,
  solid: CircleCheck,
  excluded: CircleSlash,
};

const TASK_TONES: Readonly<Record<SkillTaskState, SkillTone>> = {
  new: "neutral",
  unsolved: "danger",
  hard: "warning",
  overdue: "warning",
  learning: "accent",
  solid: "success",
  excluded: "neutral",
};

export const getSkillTaskTone = (state: SkillTaskState): SkillTone => TASK_TONES[state];

export const getSkillTaskLabel = (task: SkillTaskProgress): string => {
  switch (task.state) {
    case "new":
      return task.probability !== null
        ? `Не начата · вероятность ${task.probability}%`
        : "Не начата";
    case "unsolved":
      return "Не решено";
    case "hard":
      return `Тяжело · стадия ${task.stage}`;
    case "overdue":
      return task.overdueDays ? `Повтор просрочен на ${task.overdueDays} дн.` : "Пора повторить";
    case "learning":
      return task.stage ? `Стадия ${task.stage}` : "Решена, без оценки";
    case "solid":
      return `Закреплена · стадия ${task.stage}`;
    case "excluded":
      return "Исключена из повторений";
  }
};

/** Route of a task page, e.g. `/javascript/js150`. */
export const getSkillTaskHref = (taskId: string): string =>
  `/${getTaskSectionById(taskId)}/${taskId}`;

/** Task title without its route number: "3. Потеря контекста" → "Потеря контекста". */
export const getShortTaskTitle = (title: string): string => title.replace(/^\d+\.\s*/, "");
