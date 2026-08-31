import React, { memo } from "react";
import { useSectionOverview } from "../model/use-section-overview";
import { SectionHeroHeader } from "./SectionHeroHeader";
import { SectionKpiGrid } from "./SectionKpiGrid";
import { SectionGroupsGrid } from "./SectionGroupsGrid";
import styles from "./SectionOverviewPage.module.css";

export interface SectionOverviewPageProps {
  section: "javascript" | "react" | "algorithms";
}

export const SectionOverviewPage = memo(
  ({ section }: SectionOverviewPageProps): React.JSX.Element => {
    const {
      sectionMeta,
      stats,
      groups,
      isSolved,
      progressState,
      reviews,
      isTaskDue,
      isInitialized,
    } = useSectionOverview(section);

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

        <SectionGroupsGrid
          section={sectionMeta.id}
          groups={groups}
          isSolved={isSolved}
          completedTasks={progressState.completedTasks}
          reviews={reviews}
          isDue={isTaskDue}
          isLoading={!isInitialized}
        />
      </div>
    );
  }
);

SectionOverviewPage.displayName = "SectionOverviewPage";

export const ReactOverviewPage = memo((): React.JSX.Element => {
  return <SectionOverviewPage section="react" />;
});
ReactOverviewPage.displayName = "ReactOverviewPage";

export const JavascriptOverviewPage = memo((): React.JSX.Element => {
  return <SectionOverviewPage section="javascript" />;
});
JavascriptOverviewPage.displayName = "JavascriptOverviewPage";

export const AlgorithmsOverviewPage = memo((): React.JSX.Element => {
  return <SectionOverviewPage section="algorithms" />;
});
AlgorithmsOverviewPage.displayName = "AlgorithmsOverviewPage";

export default SectionOverviewPage;
