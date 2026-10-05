import { CURRICULUM_COUNTS } from "@/entities/task/meta";

const RU_PLURAL_RULES = new Intl.PluralRules("ru-RU");

const TASK_WORD: Record<Intl.LDMLPluralRule, string> = {
  zero: "задач",
  one: "задача",
  two: "задачи",
  few: "задачи",
  many: "задач",
  other: "задачи",
};

/** `83` → `83 задачи`, `226` → `226 задач`. */
export const formatTaskCount = (count: number): string =>
  `${count} ${TASK_WORD[RU_PLURAL_RULES.select(count)]}`;

export const TOTAL_TASK_COUNT = Object.values(CURRICULUM_COUNTS).reduce(
  (sum, count) => sum + count,
  0
);
