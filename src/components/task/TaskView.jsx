import React from "react";
import {
  CheckCircle2,
  XCircle,
  Play,
  CheckCircle,
  BookOpen,
  HelpCircle,
  ListChecks,
} from "lucide-react";
import { ALL_TASKS } from "../../react/data/tasksData";
import CandidateTab from "./CandidateTab";
import SolutionTab from "./SolutionTab";
import MaterialsTab from "./MaterialsTab";
import QuestionsTab from "./QuestionsTab";
import ChecklistTab from "./ChecklistTab";

export const TaskView = ({
  selectedTask,
  setTaskStatus,
  completedTasks,
  activeTab,
  setActiveTab,
  handleCopyCode,
  copiedCodeId,
  checklistState,
  toggleChecklistItem,
}) => {
  const activeTask =
    ALL_TASKS.find((t) => String(t.id) === String(selectedTask.id)) ||
    selectedTask;

  const CandidateComponent = activeTask.candidate;
  const SolutionComponent = activeTask.solution;

  return (
    <div className="content-inner">
      <div className="task-detail-card">
        <div className="task-header-row">
          <div>
            <h2 className="task-detail-title">
              {activeTask.title}
              {activeTask.difficulty && (
                <span className={`difficulty-badge difficulty-${activeTask.difficulty}`}>
                  {activeTask.difficulty}
                </span>
              )}
            </h2>
            <span className="task-filepath">
              Файл: <code>{activeTask.filepath}</code>
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <button
              onClick={() => setTaskStatus(activeTask.id, "solved")}
              className={`status-btn ${
                completedTasks[activeTask.id] === true ||
                completedTasks[activeTask.id] === "solved"
                  ? "solved-active"
                  : ""
              }`}
            >
              {completedTasks[activeTask.id] === true ||
              completedTasks[activeTask.id] === "solved" ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                  <CheckCircle2 size={14} /> Решено
                </span>
              ) : (
                "Решено"
              )}
            </button>

            <button
              onClick={() => setTaskStatus(activeTask.id, "unsolved")}
              className={`status-btn ${
                completedTasks[activeTask.id] === "unsolved"
                  ? "unsolved-active"
                  : ""
              }`}
            >
              {completedTasks[activeTask.id] === "unsolved" ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
                  <XCircle size={14} /> Не решено
                </span>
              ) : (
                "Не решено"
              )}
            </button>
          </div>
        </div>

        <div className="tabs-container">
          <div className="tabs-header">
            <button
              className={`tab-link ${activeTab === "candidate" ? "active" : ""}`}
              onClick={() => setActiveTab("candidate")}
            >
              <Play size={14} style={{ color: "#10b981" }} />
              <span>Песочница кандидата</span>
            </button>
            <button
              className={`tab-link ${activeTab === "solution" ? "active" : ""}`}
              onClick={() => setActiveTab("solution")}
            >
              <CheckCircle size={14} style={{ color: "#3b82f6" }} />
              <span>Решение</span>
            </button>
            <button
              className={`tab-link ${activeTab === "materials" ? "active" : ""}`}
              onClick={() => setActiveTab("materials")}
            >
              <BookOpen size={14} style={{ color: "#f59e0b" }} />
              <span>Разбор и теория</span>
            </button>
            <button
              className={`tab-link ${activeTab === "questions" ? "active" : ""}`}
              onClick={() => setActiveTab("questions")}
            >
              <HelpCircle size={14} style={{ color: "#a855f7" }} />
              <span>Вопросы (собеседование)</span>
            </button>
            <button
              className={`tab-link ${activeTab === "checklist" ? "active" : ""}`}
              onClick={() => setActiveTab("checklist")}
            >
              <ListChecks size={14} style={{ color: "var(--text-main, #ffffff)" }} />
              <span>Самопроверка ({activeTask.checklist ? activeTask.checklist.length : 0})</span>
            </button>
          </div>

          <div className="tabs-content">
            {activeTab === "candidate" && (
              <CandidateTab
                selectedTask={activeTask}
                CandidateComponent={CandidateComponent}
                handleCopyCode={handleCopyCode}
                copiedCodeId={copiedCodeId}
                setTaskStatus={setTaskStatus}
                completedTasks={completedTasks}
              />
            )}

            {activeTab === "solution" && (
              <SolutionTab
                selectedTask={activeTask}
                SolutionComponent={SolutionComponent}
                handleCopyCode={handleCopyCode}
                copiedCodeId={copiedCodeId}
                setTaskStatus={setTaskStatus}
                completedTasks={completedTasks}
              />
            )}

            {activeTab === "materials" && (
              <MaterialsTab
                selectedTask={activeTask}
                handleCopyCode={handleCopyCode}
                copiedCodeId={copiedCodeId}
              />
            )}

            {activeTab === "questions" && (
              <QuestionsTab selectedTask={activeTask} />
            )}

            {activeTab === "checklist" && (
              <ChecklistTab
                selectedTask={activeTask}
                checklistState={checklistState}
                toggleChecklistItem={toggleChecklistItem}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskView;
