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
import { getTaskById } from "../../data/tasksRegistry";
import { getDifficultyLabel } from "../../utils/difficultyHelpers";
import CandidateTab from "./CandidateTab";
import SolutionTab from "./SolutionTab";
import MaterialsTab from "./MaterialsTab";
import QuestionsTab from "./QuestionsTab";
import ChecklistTab from "./ChecklistTab";

export const TaskView = ({
  selectedTask,
  setTaskStatus,
  completedTasks = {},
  activeTab = "candidate",
  setActiveTab,
  handleCopyCode,
  copiedCodeId,
  checklistState = {},
  toggleChecklistItem,
}) => {
  const activeTask = getTaskById(selectedTask?.id) || selectedTask;

  const CandidateComponent = activeTask.candidate;
  const SolutionComponent = activeTask.solution;

  React.useEffect(() => {
    const contentArea = document.querySelector(".content-area");
    if (contentArea) {
      contentArea.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [activeTask?.id, activeTab]);

  return (
    <div className="content-inner">
      <div className="task-detail-card">
        <div className="task-header-row">
          <div className="task-title-container">
            <h2 className="task-detail-title">
              <span className="task-detail-title-text">{activeTask.title}</span>
              {activeTask.difficulty && (
                <span className={`difficulty-badge difficulty-${activeTask.difficulty}`}>
                  {getDifficultyLabel(activeTask.difficulty)}
                </span>
              )}
            </h2>
          </div>
          <div className="task-status-actions">
            <button
              type="button"
              onClick={() => setTaskStatus && setTaskStatus(activeTask.id, "solved")}
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
              type="button"
              onClick={() => setTaskStatus && setTaskStatus(activeTask.id, "unsolved")}
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
              type="button"
              onClick={() => setActiveTab && setActiveTab("candidate")}
              className={`tab-link tab-candidate ${activeTab === "candidate" ? "active" : ""}`}
            >
              <Play size={14} className="tab-icon" />
              <span>Песочница кандидата</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab && setActiveTab("solution")}
              className={`tab-link tab-solution ${activeTab === "solution" ? "active" : ""}`}
            >
              <CheckCircle size={14} className="tab-icon" />
              <span>Решение</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab && setActiveTab("materials")}
              className={`tab-link tab-materials ${activeTab === "materials" ? "active" : ""}`}
            >
              <BookOpen size={14} className="tab-icon" />
              <span>Разбор и теория</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab && setActiveTab("questions")}
              className={`tab-link tab-questions ${activeTab === "questions" ? "active" : ""}`}
            >
              <HelpCircle size={14} className="tab-icon" />
              <span>Вопросы</span>
              <span className="tab-badge">
                {activeTask.interviewerQuestions ? activeTask.interviewerQuestions.length : 0}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab && setActiveTab("checklist")}
              className={`tab-link tab-checklist ${activeTab === "checklist" ? "active" : ""}`}
            >
              <ListChecks size={14} className="tab-icon" />
              <span>Самопроверка</span>
              <span className="tab-badge">
                {activeTask.checklist ? activeTask.checklist.length : 0}
              </span>
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
