import { memo } from "react";
import { useSectionOverview } from "../model/useSectionOverview";
import { SectionHeroHeader } from "./SectionHeroHeader";
import { SectionKpiGrid } from "./SectionKpiGrid";
import { SectionDueAlert } from "./SectionDueAlert";
import { SectionGroupsGrid } from "./SectionGroupsGrid";
import styles from "./SectionOverviewPage.module.css";

export interface SectionOverviewPageProps {
  section: "javascript" | "react" | "algorithms";
}

export const SectionOverviewPage = memo(({ section }: SectionOverviewPageProps) => {
  const { sectionMeta, stats, groups, dueTasks, isSolved, progressState, reviews, isTaskDue } =
    useSectionOverview(section);

  return (
    <div className={styles.overviewContainer}>
      <SectionHeroHeader
        section={sectionMeta.id}
        title={sectionMeta.title}
        subtitle={sectionMeta.subtitle}
        badge={sectionMeta.badge}
        icon={sectionMeta.icon}
      />

      <SectionKpiGrid
        total={stats.total}
        solved={stats.solved}
        percent={stats.percent}
        remaining={stats.remaining}
      />

      <SectionDueAlert section={sectionMeta.id} dueTasks={dueTasks} />

      <SectionGroupsGrid
        section={sectionMeta.id}
        groups={groups}
        isSolved={isSolved}
        completedTasks={progressState.completedTasks}
        reviews={reviews}
        isDue={isTaskDue}
      />
    </div>
  );
});

SectionOverviewPage.displayName = "SectionOverviewPage";

export const JavascriptOverviewPage = memo(() => <SectionOverviewPage section="javascript" />);
JavascriptOverviewPage.displayName = "JavascriptOverviewPage";

export const ReactOverviewPage = memo(() => <SectionOverviewPage section="react" />);
ReactOverviewPage.displayName = "ReactOverviewPage";

export const AlgorithmsOverviewPage = memo(() => <SectionOverviewPage section="algorithms" />);
AlgorithmsOverviewPage.displayName = "AlgorithmsOverviewPage";
