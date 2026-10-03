import React from "react";
import { HardDrive } from "lucide-react";
import { clsx } from "clsx";
import { normalizeAccountName } from "@/shared/auth";
import { GaugeIndicator, JavaScriptIcon, KpiGrid } from "@/shared/ui";
import { DEBOUNCE_TASK } from "../../config/showcase-tasks";
import { TOTAL_TASK_COUNT } from "../../lib/format-task-count";
import { getShowcaseProbability } from "../../lib/showcase-probability";
import styles from "./SectionPreviews.module.css";
import local from "./ProfilePreview.module.css";

const DEBOUNCE_PROBABILITY = getShowcaseProbability(DEBOUNCE_TASK)?.probability ?? 0;

export interface ProfilePreviewProps {
  /** Name typed in the sign-up form; the preview updates live. */
  name: string;
}

/** First screen of a brand-new local profile: greeting, the home KPI grid and a first task. */
export const ProfilePreview = ({ name }: ProfilePreviewProps): React.JSX.Element => {
  const normalizedName = normalizeAccountName(name);
  const displayName = normalizedName || "гость";
  const initial = normalizedName.charAt(0).toUpperCase() || "?";

  return (
    <div className={styles.stage}>
      <div className={clsx(styles.absolute, styles.miniCard, local.profileCard)}>
        <div className={local.head}>
          <span className={local.avatar}>{initial}</span>
          <div className={local.identity}>
            <p className={local.name}>{displayName}</p>
            <p className={local.type}>Локальный профиль</p>
          </div>
          <span className={clsx(styles.chip, styles.chipGreen)}>
            <HardDrive size={11} />
            IndexedDB
          </span>
        </div>

        <p className={local.greeting}>Привет, {displayName}! С чего начнём?</p>

        <KpiGrid
          className={local.kpi}
          total={TOTAL_TASK_COUNT}
          solved={0}
          percent={0}
          remaining={TOTAL_TASK_COUNT}
        />

        <div className={local.nextTask}>
          <JavaScriptIcon size={16} />
          <span className={local.nextTitle}>
            Начать с задачи <b>debounce</b>
          </span>
          <GaugeIndicator value={DEBOUNCE_PROBABILITY} size={16} />
          <span className={local.nextProbability}>{DEBOUNCE_PROBABILITY}%</span>
        </div>
      </div>
    </div>
  );
};
