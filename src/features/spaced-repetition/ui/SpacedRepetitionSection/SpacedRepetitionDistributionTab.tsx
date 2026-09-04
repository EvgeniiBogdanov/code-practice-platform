import React, { memo } from "react";
import { clsx } from "clsx";
import { MasteryStats } from "@/entities/review";
import { Badge } from "@/shared/ui";
import { MasteryDistributionPie } from "../MasteryDistributionPie";
import styles from "./SpacedRepetitionSection.module.css";

interface StageConfig {
  id: "mastered" | "reviewing" | "learning" | "unreviewed";
  title: string;
  getDesc: (scopeLabel: string) => string;
  colorClass: "green" | "yellow" | "red" | "gray";
  countKey: keyof Pick<MasteryStats, "mastered" | "reviewing" | "learning" | "unreviewed">;
}

const STAGES: readonly StageConfig[] = [
  {
    id: "mastered",
    title: "Мастер (30-60+ дней)",
    getDesc: () => "Надёжно усвоено в долговременной памяти",
    colorClass: "green",
    countKey: "mastered",
  },
  {
    id: "reviewing",
    title: "Закрепление (7-14 дней)",
    getDesc: () => "Уверенное решение, интервалы растут",
    colorClass: "yellow",
    countKey: "reviewing",
  },
  {
    id: "learning",
    title: "Изучение (1-3 дня)",
    getDesc: () => "Активная фаза повторов и разбора нюансов",
    colorClass: "red",
    countKey: "learning",
  },
  {
    id: "unreviewed",
    title: "Ещё не в графике",
    getDesc: (scopeLabel: string) => `Задачи ${scopeLabel}, ожидающие решения`,
    colorClass: "gray",
    countKey: "unreviewed",
  },
] as const;

export interface SpacedRepetitionDistributionTabProps {
  masteryStats: MasteryStats;
  scopeLabel: string;
}

export const SpacedRepetitionDistributionTab = memo(
  ({ masteryStats, scopeLabel }: SpacedRepetitionDistributionTabProps): React.JSX.Element => {
    return (
      <div className={styles.distributionView}>
        <div className={styles.chartCol}>
          <MasteryDistributionPie masteryStats={masteryStats} height={210} />
        </div>

        <div className={styles.legendCol}>
          <div className={styles.legendHeader}>Уровни закрепления SM-2:</div>

          <div className={styles.stageList}>
            {STAGES.map((stage) => (
              <div key={stage.id} className={styles.stageItem}>
                <div className={clsx(styles.stageDot, styles[stage.colorClass])} />
                <div className={styles.stageInfo}>
                  <div className={styles.stageTitle}>{stage.title}</div>
                  <div className={styles.stageDesc}>{stage.getDesc(scopeLabel)}</div>
                </div>
                <Badge
                  variant="gray"
                  size="sm"
                  uppercase={false}
                  className={styles.stageBadge}
                >
                  {masteryStats[stage.countKey]}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

SpacedRepetitionDistributionTab.displayName = "SpacedRepetitionDistributionTab";
