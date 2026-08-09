import React from "react";
import { createFileRoute, useParams, useSearch, Link } from "@tanstack/react-router";
import { REACT_TASKS, WARMUP_TASKS } from "../../react/data/tasksData";
import TaskView from "../../components/task/TaskView";
import { usePractice } from "../../context/PracticeContext";
import { FileQuestion, Home, Code2 } from "lucide-react";

function ReactTaskPage() {
  const { taskId } = useParams({ from: "/react/$taskId" });
  const search = useSearch({ from: "/react/$taskId" });
  const context = usePractice();

  const selectedTask = REACT_TASKS.find((t) => String(t.id) === String(taskId));

  if (!selectedTask) {
    return (
      <div className="coming-soon-container" style={{ padding: "60px 20px", textAlign: "center" }}>
        <div className="coming-soon-icon" style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}>
          <FileQuestion size={36} />
        </div>
        <h2 className="coming-soon-title" style={{ fontSize: "22px", marginBottom: "8px" }}>
          Задача React не найдена
        </h2>
        <p className="coming-soon-desc" style={{ maxWidth: "460px", margin: "0 auto 24px" }}>
          Задачи с ID «{taskId}» не существует в каталоге React.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link
            to="/react/$taskId"
            params={{ taskId: String(WARMUP_TASKS[0]?.id || "1") }}
            className="home-section-btn"
          >
            <Code2 size={16} /> Перейти к первой задаче
          </Link>
          <Link to="/home" className="home-section-btn-disabled" style={{ cursor: "pointer" }}>
            <Home size={14} /> На Главную
          </Link>
        </div>
      </div>
    );
  }

  const activeTab = search?.tab || "candidate";

  return (
    <TaskView
      selectedTask={selectedTask}
      setTaskStatus={context?.setTaskStatus}
      completedTasks={context?.completedTasks || {}}
      activeTab={activeTab}
      setActiveTab={context?.setActiveTab}
      handleCopyCode={context?.handleCopyCode}
      copiedCodeId={context?.copiedCodeId}
      checklistState={context?.checklistState || {}}
      toggleChecklistItem={context?.toggleChecklistItem}
    />
  );
}

export const Route = createFileRoute("/react/$taskId")({
  validateSearch: (search) => {
    return {
      tab: typeof search?.tab === "string" ? search.tab : "candidate",
    };
  },
  component: ReactTaskPage,
});
