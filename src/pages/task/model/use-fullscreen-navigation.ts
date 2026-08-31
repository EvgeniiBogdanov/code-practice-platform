import { useCallback, useMemo, useRef, useTransition } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { Task } from "@/entities/task";

type EditorTab = "candidate" | "solution";

type FullscreenRoute =
  "/open/algorithms/$taskId" | "/open/javascript/$taskId" | "/open/react/$taskId";

interface FullscreenNavigationTarget {
  to: FullscreenRoute;
  params: {
    taskId: string;
  };
  search: {
    tab: EditorTab;
    view?: "code";
  };
}

interface UseFullscreenNavigationParams {
  task: Pick<Task, "id" | "section">;
  tab: EditorTab;
  hasVisualComponent: boolean;
}

export interface UseFullscreenNavigationReturn {
  isFullscreenTransitioning: boolean;
  preloadFullscreen: () => void;
  handleToggleFullscreen: () => void;
}

const getFullscreenRoute = (section: Task["section"]): FullscreenRoute => {
  if (section === "algorithms") return "/open/algorithms/$taskId";
  if (section === "react") return "/open/react/$taskId";
  return "/open/javascript/$taskId";
};

export const getFullscreenNavigationTarget = ({
  task,
  tab,
  hasVisualComponent,
}: UseFullscreenNavigationParams): FullscreenNavigationTarget => {
  return {
    to: getFullscreenRoute(task.section),
    params: { taskId: String(task.id) },
    search: {
      tab,
      ...(hasVisualComponent ? {} : { view: "code" }),
    },
  };
};

export const useFullscreenNavigation = ({
  task,
  tab,
  hasVisualComponent,
}: UseFullscreenNavigationParams): UseFullscreenNavigationReturn => {
  const navigate = useNavigate();
  const router = useRouter();
  const [isFullscreenTransitioning, startTransition] = useTransition();
  const isNavigationPendingRef = useRef(false);
  const preloadRef = useRef<{ key: string; promise: Promise<void> } | null>(null);
  const target = useMemo(
    () => getFullscreenNavigationTarget({ task, tab, hasVisualComponent }),
    [hasVisualComponent, tab, task]
  );
  const targetKey = `${target.to}:${target.params.taskId}:${tab}:${target.search.view ?? "split"}`;

  const ensureFullscreenPreloaded = useCallback((): Promise<void> => {
    if (preloadRef.current?.key === targetKey) return preloadRef.current.promise;

    const promise = router
      .preloadRoute(target)
      .then(() => undefined)
      .catch((error: unknown) => {
        console.warn("Не удалось предзагрузить полноэкранный редактор", error);
      });
    preloadRef.current = { key: targetKey, promise };
    return promise;
  }, [router, target, targetKey]);

  const preloadFullscreen = useCallback((): void => {
    void ensureFullscreenPreloaded();
  }, [ensureFullscreenPreloaded]);

  const handleToggleFullscreen = useCallback((): void => {
    if (isNavigationPendingRef.current) return;

    isNavigationPendingRef.current = true;
    startTransition(async () => {
      try {
        await ensureFullscreenPreloaded();
        await navigate({
          ...target,
          resetScroll: false,
        });
      } finally {
        isNavigationPendingRef.current = false;
      }
    });
  }, [ensureFullscreenPreloaded, navigate, startTransition, target]);

  return {
    isFullscreenTransitioning,
    preloadFullscreen,
    handleToggleFullscreen,
  };
};
