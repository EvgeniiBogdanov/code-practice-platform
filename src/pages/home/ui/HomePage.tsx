import React, { memo } from "react";
import { BarChart2 } from "lucide-react";
import {
  SpacedRepetitionActivityChart,
  useSpacedRepetitionData,
} from "@/features/spaced-repetition";
import { useHomeStats } from "../model/use-home-stats";
import { HomeHeroHeader } from "./HomeHeroHeader";
import { HomeCallouts } from "./HomeCallouts";
import { HomeKpiSummary } from "./HomeKpiSummary";
import { HomePracticeSections } from "./HomePracticeSections";
import { HomeFeaturesGrid } from "./HomeFeaturesGrid";
import styles from "./HomePage.module.css";

export const HomePage = memo((): React.JSX.Element => {
  const stats = useHomeStats();
  const { reviewActivityByDate, isLoading } = useSpacedRepetitionData();

  return (
    <div className={styles.homeContainer}>
      <HomeHeroHeader grandTotal={stats.grandTotal} />
      <HomeCallouts />
      <hr className={styles.divider} />
      <div className={styles.sectionBlock}>
        <div className={styles.blockHeader}>
          <BarChart2 size={16} color="var(--accent-blue, #3b82f6)" className={styles.blockIcon} />
          <h2 className={styles.blockTitle}>Общая статистика по разделам</h2>
        </div>
        <HomeKpiSummary stats={stats} />
        <SpacedRepetitionActivityChart
          activityByDate={reviewActivityByDate}
          isLoading={isLoading}
        />
      </div>
      <hr className={styles.divider} />
      <HomePracticeSections stats={stats} />
      <hr className={styles.divider} />
      <HomeFeaturesGrid />
    </div>
  );
});

HomePage.displayName = "HomePage";
