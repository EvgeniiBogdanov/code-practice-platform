import React, { memo } from "react";
import { useHomeStats } from "../model/use-home-stats";
import { HomeHeroHeader } from "./HomeHeroHeader";
import { HomeCallouts } from "./HomeCallouts";
import { HomeKpiSummary } from "./HomeKpiSummary";
import { HomePracticeSections } from "./HomePracticeSections";
import { HomeFeaturesGrid } from "./HomeFeaturesGrid";
import styles from "./HomePage.module.css";

export const HomePage = memo((): React.JSX.Element => {
  const stats = useHomeStats();

  return (
    <div className={styles.homeContainer}>
      <HomeHeroHeader grandTotal={stats.grandTotal} />
      <HomeCallouts />
      <hr className={styles.divider} />
      <HomeKpiSummary stats={stats} />
      <hr className={styles.divider} />
      <HomePracticeSections stats={stats} />
      <hr className={styles.divider} />
      <HomeFeaturesGrid />
    </div>
  );
});

HomePage.displayName = "HomePage";
