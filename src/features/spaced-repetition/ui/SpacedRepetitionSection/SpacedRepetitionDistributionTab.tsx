import { memo } from "react";
import { Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { MasteryStats } from "@/entities/review";
import { VisxMasteryPie } from "../VisxMasteryPie";
import styles from "./SpacedRepetitionSection.module.css";

interface SpacedRepetitionDistributionTabProps {
  masteryStats: MasteryStats;
  scopeLabel: string;
}

export const SpacedRepetitionDistributionTab = memo(
  ({ masteryStats, scopeLabel }: SpacedRepetitionDistributionTabProps) => {
    const hasReviews = masteryStats.totalReviewed > 0;

    return (
      <div className={styles.distributionView}>
        <div className={styles.chartCol}>
          <VisxMasteryPie masteryStats={masteryStats} height={210} />
        </div>

        <div className={styles.legendCol}>
          <div className={styles.legendHeader}>Уровни закрепления SM-2:</div>

          <div className={styles.stageList}>
            <div className={styles.stageItem}>
              <div className={clsx(styles.stageDot, styles.green)} />
              <div className={styles.stageInfo}>
                <div className={styles.stageTitle}>Мастер (30-60+ дней)</div>
                <div className={styles.stageDesc}>Надёжно усвоено в долговременной памяти</div>
              </div>
              <div className={styles.stageCount}>{masteryStats.mastered}</div>
            </div>

            <div className={styles.stageItem}>
              <div className={clsx(styles.stageDot, styles.yellow)} />
              <div className={styles.stageInfo}>
                <div className={styles.stageTitle}>Закрепление (7-14 дней)</div>
                <div className={styles.stageDesc}>Уверенное решение, интервалы растут</div>
              </div>
              <div className={styles.stageCount}>{masteryStats.reviewing}</div>
            </div>

            <div className={styles.stageItem}>
              <div className={clsx(styles.stageDot, styles.red)} />
              <div className={styles.stageInfo}>
                <div className={styles.stageTitle}>Изучение (1-3 дня)</div>
                <div className={styles.stageDesc}>Активная фаза повторов и разбора нюансов</div>
              </div>
              <div className={styles.stageCount}>{masteryStats.learning}</div>
            </div>

            <div className={styles.stageItem}>
              <div className={clsx(styles.stageDot, styles.gray)} />
              <div className={styles.stageInfo}>
                <div className={styles.stageTitle}>Ещё не в графике</div>
                <div className={styles.stageDesc}>Задачи {scopeLabel}, ожидающие решения</div>
              </div>
              <div className={styles.stageCount}>{masteryStats.unreviewed}</div>
            </div>
          </div>

          {!hasReviews && (
            <div className={styles.onboardingHint}>
              <div className={styles.onboardingHintTitle}>
                <Sparkles size={13} style={{ color: "var(--accent-blue, #3b82f6)" }} />
                <span>Как включить задачи в график:</span>
              </div>
              <div className={styles.onboardingHintText}>
                При решении задач оценивайте их сложность (Легко / Средне / Сложно). Алгоритм SM-2
                автоматически сформирует цикл повторений (1д ➔ 3д ➔ 7д ➔ 14д ➔ 30д ➔ 60+д).
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

SpacedRepetitionDistributionTab.displayName = "SpacedRepetitionDistributionTab";
