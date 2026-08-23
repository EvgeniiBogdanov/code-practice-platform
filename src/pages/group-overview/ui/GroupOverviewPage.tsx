import React from "react";
import { useGroupOverview } from "../model/useGroupOverview";
import { GroupHeroHeader } from "./GroupHeroHeader";
import { GroupMetaBadges } from "./GroupMetaBadges";
import { GroupToolbar } from "./GroupToolbar";
import { GroupTaskList } from "./GroupTaskList";
import { GroupTaskCards } from "./GroupTaskCards";
import { GroupTheoryArticle } from "./GroupTheoryArticle";
import { GroupPracticeCards } from "./GroupPracticeCards";
import styles from "./GroupOverviewPage.module.css";

export interface GroupOverviewPageProps {
  groupId: string;
}

export const GroupOverviewPage = ({ groupId }: GroupOverviewPageProps) => {
  const {
    groupMeta,
    filteredTasks,
    groupedSubgroups,
    hasSubgroups,
    section,
    taskRoute,
    statusFilter,
    setStatusFilter,
    viewMode,
    setViewMode,
    isSubgroupOpen,
    toggleSubgroup,
    readingTimeMinutes,
    firstTask,
    practiceTasksList,
    articleLinksList,
    getTaskStatus,
    getTaskGradientClass,
    getTaskTooltipTitle,
    formatLastSolved,
    formatNextReviewDate,
    isTaskDue,
    reviews,
    completedTasks,
  } = useGroupOverview(groupId);

  const hasArticle = Boolean(groupMeta.infoRaw && groupMeta.infoRaw.trim());

  return (
    <div className={styles.taskViewContainer}>
      <article className={styles.folderPageWrapper}>
        <GroupHeroHeader
          groupMeta={groupMeta}
          firstTask={firstTask}
          section={section}
          taskRoute={taskRoute}
        />

        <GroupMetaBadges
          readingTimeMinutes={readingTimeMinutes}
          hasPracticeTasks={practiceTasksList.length > 0}
          hasArticleLinks={articleLinksList.length > 0}
          hasArticle={hasArticle}
        />

        <GroupToolbar
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {viewMode === "list" ? (
          <GroupTaskList
            tasks={filteredTasks}
            groupedSubgroups={groupedSubgroups}
            hasSubgroups={hasSubgroups}
            groupName={groupMeta.name}
            folderColor={groupMeta.color}
            isSubgroupOpen={isSubgroupOpen}
            toggleSubgroup={toggleSubgroup}
            taskRoute={taskRoute}
            getTaskStatus={getTaskStatus}
            getTaskGradientClass={getTaskGradientClass}
            formatLastSolved={formatLastSolved}
            formatNextReviewDate={formatNextReviewDate}
            isTaskDue={isTaskDue}
            reviews={reviews}
            completedTasks={completedTasks}
            onResetFilter={() => setStatusFilter("all")}
          />
        ) : (
          <GroupTaskCards
            tasks={filteredTasks}
            taskRoute={taskRoute}
            groupTitle={groupMeta.title || groupMeta.name}
            folderColor={groupMeta.color}
            getTaskStatus={getTaskStatus}
            getTaskGradientClass={getTaskGradientClass}
            getTaskTooltipTitle={getTaskTooltipTitle}
            formatLastSolved={formatLastSolved}
            formatNextReviewDate={formatNextReviewDate}
            isTaskDue={isTaskDue}
            reviews={reviews}
            onResetFilter={() => setStatusFilter("all")}
          />
        )}

        <GroupTheoryArticle groupMeta={groupMeta} />

        <GroupPracticeCards
          practiceTasksList={practiceTasksList}
          articleLinksList={articleLinksList}
          taskRoute={taskRoute}
        />
      </article>
    </div>
  );
};

export default GroupOverviewPage;
