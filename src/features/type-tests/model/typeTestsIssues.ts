import { APP_VERSION, REPOSITORY_URL } from "@/shared/config";

interface IssueDraft {
  taskId: string;
  testsHash: string;
  /** What went wrong, e.g. the failed case name or the engine error. Never the learner's code. */
  details: string;
}

/**
 * GitHub issue form prefilled with facts about the task. The learner's solution is not
 * included: it would leak private code and may exceed the URL length limit.
 */
export const buildIssueUrl = (
  { taskId, testsHash, details }: IssueDraft,
  title: string
): string => {
  const body = [
    `Задача: ${taskId}`,
    `Версия приложения: ${APP_VERSION}`,
    `Хеш тестов: ${testsHash}`,
    `Что произошло: ${details}`,
    "",
    "Решение (вставьте сюда, если хотите приложить):",
    "```ts",
    "",
    "```",
  ].join("\n");
  const params = new URLSearchParams({ title: `[${taskId}] ${title}`, body });
  return `${REPOSITORY_URL}/issues/new?${params.toString()}`;
};
