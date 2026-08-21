import React, { useEffect } from "react";
import { createFileRoute, useParams, useSearch, Link, Navigate } from "@tanstack/react-router";
import { JS_TASKS } from "../../javascript/data/tasksData";
import { getGroupMeta } from "../../javascript/data/groupConfig";
import { getTaskById } from "../../data/tasksRegistry";
import TaskView from "../../components/task/TaskView";
import GroupOverviewView from "../../components/task/GroupOverviewView";
import { usePractice } from "../../context/PracticeContext";
import { FileQuestion, Home, Zap } from "lucide-react";

function JavascriptTaskPage() {
  const { taskId } = useParams({ from: "/javascript/$taskId" });
  const search = useSearch({ from: "/javascript/$taskId" });
  const context = usePractice();

  // Save last selected JavaScript task/folder
  useEffect(() => {
    if (taskId) {
      localStorage.setItem("playground_last_selected_task_id_javascript", taskId);
    }
  }, [taskId]);

  // 1. Проверка на запрос страницы обзора группы/папки JavaScript
  if (taskId.startsWith("group-") || taskId.startsWith("subgroup-")) {
    const rawGroupName = decodeURIComponent(taskId.replace(/^group-|^subgroup-/, ""));
    const groupTasks = JS_TASKS.filter(
      (t) =>
        t.group === rawGroupName ||
        t.subgroup === rawGroupName ||
        `${t.group}/${t.subgroup}` === rawGroupName ||
        `${t.group}-${t.subgroup}` === rawGroupName
    );
    if (groupTasks.length === 0) {
      return <Navigate to="/javascript/$taskId" params={{ taskId: "group-Типы данных" }} replace />;
    }
    const meta = getGroupMeta(rawGroupName);
    const isSub = taskId.startsWith("subgroup-") || Boolean(meta.isSubgroup);
    const subgroupTask = isSub
      ? JS_TASKS.find(
          (t) =>
            t.subgroup === rawGroupName ||
            `${t.group}-${t.subgroup}` === rawGroupName ||
            `${t.group}/${t.subgroup}` === rawGroupName
        )
      : null;
    const titleName = subgroupTask ? subgroupTask.subgroup : (meta.name || rawGroupName);
    const groupMeta = {
      name: titleName,
      title: titleName,
      ...meta,
    };
    return <GroupOverviewView groupMeta={groupMeta} groupTasks={groupTasks} />;
  }

  const selectedTask = getTaskById(taskId);

  if (!selectedTask) {
    return <Navigate to="/javascript/$taskId" params={{ taskId: "group-Типы данных" }} replace />;
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
