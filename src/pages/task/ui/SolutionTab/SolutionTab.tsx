import React, { memo } from "react";
import { ArrowDown } from "lucide-react";
import { clsx } from "clsx";
import { Task } from "@/entities/task";
import { Tooltip, Accordion, ErrorBoundary, ViewModeToggle } from "@/shared/ui";
import { CodeEditor } from "@/features/code-editor";
import { JsConsole, ReactLivePreview } from "@/features/code-runner";
import { useSolutionTab } from "../../model/use-solution-tab";
import { SolutionVariantsRow } from "./SolutionVariantsRow";
import styles from "./SolutionTab.module.css";

export interface SolutionTabProps {
  task: Task;
  className?: string;
}

export const SolutionTab = memo(({ task, className }: SolutionTabProps): React.JSX.Element => {
  const {
    hasVisualComponent,
    solutions,
    selectedSolutionIdx,
    setSelectedSolutionIdx,
    viewMode,
    setViewMode,
    activeFileIdx,
    setActiveFileIdx,
    isHintExpanded,
    setIsHintExpanded,
    files,
    activeFile,
    consoleLogs,
    isRunning,
    lastExecution,
    isConsoleVisible,
    consoleWrapperRef,
    recommendationNote,
    isRecommended,
    badgeText,
    handleToggleFullscreen,
    handleCodeChange,
    handleResetCode,
    handleRunCode,
    handleStopCode,
    handleClearConsole,
  } = useSolutionTab(task);

  return (
    <div className={clsx(styles.container, className)}>
      <SolutionVariantsRow
        solutions={solutions}
        selectedIdx={selectedSolutionIdx}
        onSelect={setSelectedSolutionIdx}
      />

      {recommendationNote && (
        <Accordion
          size="xs"
          color={isRecommended ? "green" : "orange"}
          icon={<span>{isRecommended ? "💡" : "📌"}</span>}
          title={<strong>{badgeText}:</strong>}
          isOpen={isHintExpanded}
          onToggle={() => setIsHintExpanded((prev) => !prev)}
        >
          <div className={styles.recommendationText}>{recommendationNote}</div>
        </Accordion>
      )}

      {hasVisualComponent && <ViewModeToggle mode={viewMode} onChange={setViewMode} />}

      <ErrorBoundary>
        {hasVisualComponent && viewMode === "preview" ? (
          <ReactLivePreview
            task={task}
            files={files}
            activeFileIdx={activeFileIdx}
            currentCode={activeFile.code}
            storagePrefix="sol"
            variantIdx={selectedSolutionIdx}
          />
        ) : (
          <>
            <CodeEditor
              key={`sol_${task.id}_${selectedSolutionIdx}_${activeFileIdx}`}
              code={activeFile?.code || ""}
              onChange={handleCodeChange}
              onRun={hasVisualComponent ? undefined : () => handleRunCode()}
              onReset={handleResetCode}
              files={files}
              activeFileIdx={activeFileIdx}
              onFileSelect={setActiveFileIdx}
              filepath={activeFile.name}
              onToggleFullscreen={handleToggleFullscreen}
              bottomConsole={
                !hasVisualComponent ? (
                  <div ref={consoleWrapperRef}>
                    <JsConsole
                      logs={consoleLogs}
                      isRunning={isRunning}
                      lastExecution={lastExecution}
                      filename={activeFile.name}
                      onRun={() => handleRunCode()}
                      onStop={handleStopCode}
                      onClear={handleClearConsole}
                    />
                  </div>
                ) : null
              }
            />

            {!hasVisualComponent && !isConsoleVisible && (
              <Tooltip content="Перейти к консоли" side="left" sideOffset={10}>
                <button
                  type="button"
                  className={styles.quickScrollConsoleBtn}
                  onClick={() =>
                    consoleWrapperRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "nearest",
                    })
                  }
                  aria-label="Перейти к консоли"
                >
                  <ArrowDown size={17} />
                </button>
              </Tooltip>
            )}
          </>
        )}
      </ErrorBoundary>
    </div>
  );
});

SolutionTab.displayName = "SolutionTab";
