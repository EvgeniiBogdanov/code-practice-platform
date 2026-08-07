import React, { useState } from "react";
import { Lock, Check, Copy, Eye, Code2 } from "lucide-react";
import { ALL_TASKS } from "../../react/data/tasksData";
import ErrorBoundary from "../common/ErrorBoundary";
import { highlightJS } from "../../utils/codeHighlighter";

export const CandidateTab = ({
  selectedTask,
  CandidateComponent,
  handleCopyCode,
  copiedCodeId,
}) => {
  const currentTask =
    ALL_TASKS.find((t) => String(t.id) === String(selectedTask.id)) ||
    selectedTask;

  const hasCandidateComponent =
    Boolean(CandidateComponent) &&
    typeof CandidateComponent !== "string" &&
    !currentTask.isRaw;
  const rawCodeText =
    currentTask.rawCandidate ||
    (typeof currentTask.candidate === "string" ? currentTask.candidate : "");
  const hasRawCode = Boolean(rawCodeText);

  const [viewMode, setViewMode] = useState("preview"); // 'preview' | 'code'

  return (
    <div style={{ width: "100%" }}>
      {hasCandidateComponent && hasRawCode && (
        <div className="view-mode-toggle-bar">
          <button
            className={`view-mode-btn ${viewMode === "preview" ? "active" : ""}`}
            onClick={() => setViewMode("preview")}
            title="Просмотр UI песочницы"
          >
            <Eye size={12} />
            <span>Интерфейс</span>
          </button>
          <button
            className={`view-mode-btn ${viewMode === "code" ? "active" : ""}`}
            onClick={() => setViewMode("code")}
            title="Просмотр исходного кода кандидата"
          >
            <Code2 size={12} />
            <span>Код</span>
          </button>
        </div>
      )}

      {hasCandidateComponent && viewMode === "preview" ? (
        <div className="browser-mockup">
          <div className="browser-mockup-header">
            <div className="browser-mockup-dots">
              <span className="browser-dot close" />
              <span className="browser-dot minimize" />
              <span className="browser-dot maximize" />
            </div>
            <div className="browser-mockup-address">
              <Lock size={12} style={{ marginRight: 4, display: "inline-block", verticalAlign: "middle", color: "#10b981" }} /> localhost:5173/
              {currentTask.filepath.split("/").pop()}
            </div>
            <div style={{ width: "52px" }} />
          </div>
          <div className="browser-mockup-body">
            <ErrorBoundary taskKey={currentTask.id}>
              {CandidateComponent ? (
                <CandidateComponent />
              ) : (
                <p className="no-component">Компонент не найден</p>
              )}
            </ErrorBoundary>
          </div>
        </div>
      ) : (
        <div className="code-preview-wrapper">
          <button
            className="code-copy-btn"
            onClick={() => handleCopyCode(`cand-${currentTask.id}`, rawCodeText)}
            title={copiedCodeId === `cand-${currentTask.id}` ? "Скопировано!" : "Копировать код"}
          >
            {copiedCodeId === `cand-${currentTask.id}` ? (
              <Check size={13} style={{ color: "#10b981" }} />
            ) : (
              <Copy size={13} />
            )}
          </button>
          <pre className="code-preview-block">
            <code
              dangerouslySetInnerHTML={{
                __html: highlightJS(rawCodeText || "// Код кандидата подготавливается"),
              }}
            />
          </pre>
        </div>
      )}
    </div>
  );
};

export default CandidateTab;
