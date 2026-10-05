let cachedExplanations: Record<string, string> | null = null;
let pendingPromise: Promise<Record<string, string>> | null = null;

export const loadTaskExplanations = async (): Promise<Record<string, string>> => {
  if (cachedExplanations) {
    return cachedExplanations;
  }
  if (pendingPromise) {
    return pendingPromise;
  }

  pendingPromise = import("../curriculum/taskExplanations")
    .then((module) => {
      cachedExplanations = module.TASK_EXPLANATIONS as Record<string, string>;
      return cachedExplanations;
    })
    .finally(() => {
      pendingPromise = null;
    });

  return pendingPromise;
};

export const getCachedTaskExplanation = (taskId: string | number): string | undefined => {
  return cachedExplanations?.[String(taskId)];
};
