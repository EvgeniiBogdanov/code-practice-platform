import React, { memo } from "react";
import { clsx } from "clsx";
import { Task, TaskSolution, getTaskFiles, hasTaskVisualComponent } from "@/entities/task";
import { Accordion, ViewModeToggle, UiSkeleton } from "@/shared/ui";
import { CodeEditor } from "@/features/code-editor";
import { SolutionVariantsRow } from "../SolutionTab/SolutionVariantsRow";
import solutionStyles from "../SolutionTab/SolutionTab.module.css";
import styles from "./TaskTabSkeleton.module.css";

export interface SolutionTabSkeletonProps {
  task?: Task;
  className?: string;
}

export const SolutionTabSkeleton = memo(
  ({ task, className }: SolutionTabSkeletonProps): React.JSX.Element => {
    const solutions =
      task?.solutions || (task as { variants?: TaskSolution[] } | undefined)?.variants || [];
    const activeSolution = solutions[0];
    const recommendationNote = activeSolution?.recommendationNote || task?.recommendationNote;
    const isRecommended = activeSolution?.isRecommended ?? task?.isRecommended;
    const badgeText =
      activeSolution?.badge || (isRecommended ? "Рекомендуемый подход" : "Вариант решения");

    const files = task ? getTaskFiles(task, "solution") : [];
    const hasVisualComponent = task ? hasTaskVisualComponent(task, files) : false;
    const initialFileName = solutions[0]?.files?.[0]?.name || files[0]?.name || "main.js";
    const initialCode = activeSolution?.code || files[0]?.code || "";

    return (
      <div className={clsx(styles.container, className)} aria-hidden="true">
        {/* Solution Variant Row with real buttons if multiple solutions exist */}
        {task ? (
          <SolutionVariantsRow
            solutions={solutions}
            selectedIdx={0}
            onSelect={() => {}}
          />
        ) : (
          <div className={styles.variantsRow}>
            <div className={styles.variantBtn}>
              <UiSkeleton width={140} height={12} radius={3} />
            </div>
          </div>
        )}

        {/* Static recommendation note Accordion matching SolutionTab */}
        {recommendationNote && (
          <Accordion
            size="xs"
            color={isRecommended ? "green" : "orange"}
            icon={<span>{isRecommended ? "💡" : "📌"}</span>}
            title={<strong>{badgeText}:</strong>}
            isOpen={false}
            onToggle={() => {}}
          >
            <div className={solutionStyles.recommendationText}>{recommendationNote}</div>
          </Accordion>
        )}

        {/* View Mode Toggle for React preview components */}
        {hasVisualComponent && <ViewModeToggle mode="code" onChange={() => {}} />}

        {/* Real CodeEditor in readOnly mode */}
        <CodeEditor
          code={initialCode}
          onChange={() => {}}
          readOnly
          filepath={initialFileName}
          files={files}
        />
      </div>
    );
  }
);

SolutionTabSkeleton.displayName = "SolutionTabSkeleton";



