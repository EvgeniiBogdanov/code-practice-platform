import React, { memo } from "react";
import { clsx } from "clsx";
import { Task } from "@/entities/task";
import {
  Accordion,
  ErrorBoundary,
  ViewModeToggle,
  UiFullscreenPanel,
  UiSkeleton,
  ResizableSplitPane,
} from "@/shared/ui";
import { CodeEditor } from "@/features/code-editor";
import { JsConsole, ReactLivePreview } from "@/features/code-runner";
import { useSolutionTab } from "../../model/useSolutionTab";
import { EDITOR_PLACEHOLDER_HEIGHT } from "../../model/editorPlaceholder";
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
    isFilesReady,
    activeFile,
    consoleLogs,
    isRunning,
    lastExecution,
    tabRef,
    recommendationNote,
    isRecommended,
    hasWarning,
    badgeText,
    handleCodeChange,
    handleFilesChange,
    handleResetCode,
    handleRunCode,
    handleStopCode,
    handleClearConsole,
  } = useSolutionTab(task);

  return (
    <div ref={tabRef} className={clsx(styles.container, className)}>
      <SolutionVariantsRow
        solutions={solutions}
        selectedIdx={selectedSolutionIdx}
        onSelect={setSelectedSolutionIdx}
      />

      {recommendationNote && (
        <Accordion
          size="xs"
          color={isRecommended ? "green" : hasWarning ? "orange" : "orange"}
          icon={<span>{isRecommended ? "💡" : hasWarning ? "⚠️" : "📌"}</span>}
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
            {isFilesReady ? (
              <UiFullscreenPanel label="Редактор решения">
                {({ isFullscreen, isTransitioning, toggleFullscreen }) => (
                  <ResizableSplitPane
                    layout={isFullscreen ? (hasVisualComponent ? "split" : "single") : "stack"}
                    className={clsx(
                      styles.editorWorkspace,
                      isFullscreen && styles.fullscreenWorkspace
                    )}
                    left={
                      <CodeEditor
                        key={`sol_${task.section}_${task.id}_${selectedSolutionIdx}_${activeFileIdx}`}
                        code={activeFile?.code || ""}
                        onChange={handleCodeChange}
                        onFilesChange={handleFilesChange}
                        onRun={() => handleRunCode()}
                        onReset={handleResetCode}
                        files={files}
                        activeFileIdx={activeFileIdx}
                        onFileSelect={setActiveFileIdx}
                        filepath={activeFile.name}
                        historyScope={{
                          taskKey: `${task.section}:${task.id}`,
                          documentKey: `solution:${selectedSolutionIdx}:${activeFileIdx}`,
                        }}
                        isFullscreen={isFullscreen}
                        fillHeight={isFullscreen}
                        onToggleFullscreen={toggleFullscreen}
                        isFullscreenTransitioning={isTransitioning}
                        bottomConsole={
                          <JsConsole
                            logs={consoleLogs}
                            isRunning={isRunning}
                            lastExecution={lastExecution}
                            filename={activeFile.name}
                            onRun={() => handleRunCode()}
                            onStop={handleStopCode}
                            onClear={handleClearConsole}
                          />
                        }
                      />
                    }
                    right={
                      isFullscreen && hasVisualComponent ? (
                        <ReactLivePreview
                          task={task}
                          files={files}
                          activeFileIdx={activeFileIdx}
                          currentCode={activeFile.code}
                          storagePrefix="sol"
                          variantIdx={selectedSolutionIdx}
                          fullHeight
                        />
                      ) : null
                    }
                  />
                )}
              </UiFullscreenPanel>
            ) : (
              <UiSkeleton height={EDITOR_PLACEHOLDER_HEIGHT} />
            )}
          </>
        )}
      </ErrorBoundary>
    </div>
  );
});

SolutionTab.displayName = "SolutionTab";
