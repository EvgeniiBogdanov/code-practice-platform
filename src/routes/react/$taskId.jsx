import React, { useEffect } from "react";
import { createFileRoute, useParams, useSearch, Link, Navigate } from "@tanstack/react-router";
import { REACT_TASKS, WARMUP_TASKS } from "../../react/data/tasksData";
import { REACT_GROUPS_CONFIG } from "../../react/data/groupConfig";
import { getTaskById } from "../../data/tasksRegistry";
import TaskView from "../../components/task/TaskView";
import GroupOverviewView from "../../components/task/GroupOverviewView";
import { usePractice } from "../../context/PracticeContext";
import {
  FileQuestion,
  Home,
  Code2,
} from "lucide-react";

function ReactTaskPage() {
  const { taskId } = useParams({ from: "/react/$taskId" });
  const search = useSearch({ from: "/react/$taskId" });
  const context = usePractice();

  // Save last selected React task/folder
  useEffect(() => {
    if (taskId && (REACT_GROUPS_CONFIG[taskId] || REACT_TASKS.some((t) => String(t.id) === String(taskId)))) {
      localStorage.setItem("playground_last_selected_task_id_react", taskId);
    }
  }, [taskId]);

  // 1. Проверка на страницу группы/категории React
  if (taskId.startsWith("group-") && REACT_GROUPS_CONFIG[taskId]) {
    const config = REACT_GROUPS_CONFIG[taskId];
    const groupMeta = {
      name: config.name,
      title: config.name,
      desc: config.desc,
      icon: config.icon,
      color: config.color,
      bg: config.bg || "rgba(59, 130, 246, 0.12)",
    };
    return <GroupOverviewView groupMeta={groupMeta} groupTasks={config.tasks} />;
  }

  const selectedTask = getTaskById(taskId);

  if (!selectedTask) {
    return <Navigate to="/react/$taskId" params={{ taskId: "group-warmup" }} replace />;
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
