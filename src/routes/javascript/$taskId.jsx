import React from "react";
import { createFileRoute, useParams, useSearch, Link } from "@tanstack/react-router";
import { JS_TASKS } from "../../javascript/data/tasksData";
import TaskView from "../../components/task/TaskView";
import { usePractice } from "../../context/PracticeContext";
import { FileQuestion, Home, Zap } from "lucide-react";

function JavascriptTaskPage() {
  const { taskId } = useParams({ from: "/javascript/$taskId" });
  const search = useSearch({ from: "/javascript/$taskId" });
  const context = usePractice();

  const selectedTask = JS_TASKS.find((t) => String(t.id) === String(taskId));

  if (!selectedTask) {
    return (
      <div className="coming-soon-container" style={{ padding: "60px 20px", textAlign: "center" }}>
        <div className="coming-soon-icon" style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}>
          <FileQuestion size={36} />
        </div>
        <h2 className="coming-soon-title" style={{ fontSize: "22px", marginBottom: "8px" }}>
          Задача JavaScript не найдена
        </h2>
        <p className="coming-soon-desc" style={{ maxWidth: "460px", margin: "0 auto 24px" }}>
          Задачи с ID «{taskId}» не существует в каталоге JavaScript.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link
            to="/javascript/$taskId"
            params={{ taskId: String(JS_TASKS[0]?.id || "js-loops-1") }}
            className="home-section-btn"
            style={{ background: "#f59e0b" }}
          >
            <Zap size={16} /> Перейти к первой задаче JS
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

export const Route = createFileRoute("/javascript/$taskId")({
  validateSearch: (search) => {
    return {
      tab: typeof search?.tab === "string" ? search.tab : "candidate",
    };
  },
  component: JavascriptTaskPage,
});
