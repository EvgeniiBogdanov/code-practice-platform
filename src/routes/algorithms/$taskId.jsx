import React, { useEffect } from "react";
import { createFileRoute, useParams, useSearch, Link, Navigate } from "@tanstack/react-router";
import { ALGO_TASKS } from "../../algorithms/data/tasksData";
import { getAlgoGroupMetaByInfoId } from "../../algorithms/data/groupConfig";
import { getTaskById } from "../../data/tasksRegistry";
import TaskView from "../../components/task/TaskView";
import GroupOverviewView from "../../components/task/GroupOverviewView";
import { usePractice } from "../../context/PracticeContext";
import { FileQuestion, Home, Brain } from "lucide-react";

function AlgorithmsTaskPage() {
  const { taskId } = useParams({ from: "/algorithms/$taskId" });
  const search = useSearch({ from: "/algorithms/$taskId" });
  const context = usePractice();

  // Save last selected Algorithms task/folder
  useEffect(() => {
    if (taskId) {
      localStorage.setItem("playground_last_selected_task_id_algorithms", taskId);
    }
  }, [taskId]);

  // 1. Проверка на запрос страницы обзора алгоритмической группы (например group-two-pointers)
  const groupMeta = getAlgoGroupMetaByInfoId(taskId);
  if (groupMeta) {
    const groupTasks = ALGO_TASKS.filter((t) => t.group === groupMeta.name);
    return <GroupOverviewView groupMeta={groupMeta} groupTasks={groupTasks} />;
  }

  // 2. Иначе ищем конкретную задачу тренажёра
  const selectedTask = getTaskById(taskId);

  if (!selectedTask) {
    return <Navigate to="/algorithms/$taskId" params={{ taskId: "group-two-pointers" }} replace />;
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

export const Route = createFileRoute("/algorithms/$taskId")({
  validateSearch: (search) => {
    return {
      tab: typeof search?.tab === "string" ? search.tab : "candidate",
    };
  },
  component: AlgorithmsTaskPage,
});
