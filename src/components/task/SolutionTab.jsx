import React, { useState, useEffect } from "react";
import { Lock, Check, Copy, Eye, Code2, FileCode } from "lucide-react";
import { ALL_TASKS } from "../../react/data/tasksData";
import ErrorBoundary from "../common/ErrorBoundary";
import { highlightJS } from "../../utils/codeHighlighter";
import { parseSolutionCodeAndExplanation } from "../../utils/solutionParser";

export const SolutionTab = ({
  selectedTask,
  SolutionComponent,
  handleCopyCode,
  copiedCodeId,
}) => {
  const currentTask =
    ALL_TASKS.find((t) => String(t.id) === String(selectedTask.id)) ||
    selectedTask;

  const hasSolutionComponent =
    Boolean(SolutionComponent) &&
    typeof SolutionComponent !== "string" &&
    !currentTask.isRaw;
  const [viewMode, setViewMode] = useState("preview"); // 'preview' | 'code'
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);

  useEffect(() => {
    setActiveVariantIndex(0);
  }, [currentTask.id]);

  const solutionVariants = currentTask.solutions || [
    {
      title: "Основное решение",
      rawSolution:
        currentTask.rawSolution ||
        (typeof currentTask.solution === "string" ? currentTask.solution : ""),
      filepath: currentTask.filepath,
    },
  ];

  const currentVariant = solutionVariants[activeVariantIndex] || solutionVariants[0];
  const rawText = currentVariant.rawSolution || "";
  const { code } = parseSolutionCodeAndExplanation(rawText);

  return (
    <div style={{ width: "100%" }}>
      {/* Варианты решений в отдельных файлах */}
      {solutionVariants.length > 1 && (
        <div className="solution-variants-bar">
          {solutionVariants.map((variant, idx) => (
            <button
              key={idx}
              onClick={() => setActiveVariantIndex(idx)}
              className={`solution-variant-btn ${activeVariantIndex === idx ? "active" : ""}`}
            >
              <FileCode size={13} />
              <span>{variant.title}</span>
              {variant.isRecommended && (
                <span className="solution-variant-recommended-tag">
                  Рекомендуется
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Пометка о предпочтительности варианта на собеседовании */}
      {currentVariant.recommendationNote && (
        <div
          className={`solution-recommendation-card ${
            currentVariant.isRecommended ? "is-recommended" : ""
          }`}
        >
          <div className="solution-recommendation-header">
            <span>{currentVariant.isRecommended ? "💡" : "📌"}</span>
            <span>{currentVariant.badge || "Пометка для собеседования"}:</span>
          </div>
          <div className="solution-recommendation-text">
            {currentVariant.recommendationNote}
          </div>
        </div>
      )}

      {hasSolutionComponent && (
        <div className="view-mode-toggle-bar">
          <button
            className={`view-mode-btn ${viewMode === "preview" ? "active" : ""}`}
            onClick={() => setViewMode("preview")}
            title="Просмотр UI решения"
          >
            <Eye size={12} />
            <span>Интерфейс</span>
          </button>
          <button
            className={`view-mode-btn ${viewMode === "code" ? "active" : ""}`}
            onClick={() => setViewMode("code")}
            title="Просмотр исходного кода"
          >
            <Code2 size={12} />
            <span>Код</span>
          </button>
        </div>
      )}

      {hasSolutionComponent && viewMode === "preview" ? (
        <div className="browser-mockup">
          <div className="browser-mockup-header">
            <div className="browser-mockup-dots">
              <span className="browser-dot close" />
              <span className="browser-dot minimize" />
              <span className="browser-dot maximize" />
            </div>
            <div className="browser-mockup-address">
              <Lock size={12} style={{ marginRight: 4, display: "inline-block", verticalAlign: "middle", color: "#10b981" }} /> localhost:5173/
              {(currentVariant.filepath || currentTask.filepath).split("/").pop()}
            </div>
            <div style={{ width: "52px" }} />
          </div>
          <div className="browser-mockup-body">
            <ErrorBoundary taskKey={`sol-${currentTask.id}`}>
              <SolutionComponent />
            </ErrorBoundary>
          </div>
        </div>
      ) : (
        <div className="code-preview-wrapper">
          <button
            className="code-copy-btn"
            onClick={() => handleCopyCode(`sol-${currentTask.id}-${activeVariantIndex}`, code)}
            title={copiedCodeId === `sol-${currentTask.id}-${activeVariantIndex}` ? "Скопировано!" : "Копировать код"}
          >
            {copiedCodeId === `sol-${currentTask.id}-${activeVariantIndex}` ? (
              <Check size={13} style={{ color: "#10b981" }} />
            ) : (
              <Copy size={13} />
            )}
          </button>
          <pre className="code-preview-block">
            <code
              dangerouslySetInnerHTML={{
                __html: highlightJS(
                  code || "// Код решения подготавливается",
                ),
              }}
            />
          </pre>
        </div>
      )}
    </div>
  );
};

export default SolutionTab;
