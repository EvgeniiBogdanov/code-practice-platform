import React from "react";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { TaskMetaBadges } from "@/entities/task";
import { JavaScriptIcon, UiKbd } from "@/shared/ui";
import { DEBOUNCE_TASK } from "../../config/showcaseTasks";
import { PreviewCard } from "./PreviewCard";
import styles from "./HeroPreviews.module.css";

/** Task page header: breadcrumbs, title and the real meta badges with the probability gauge. */
export const TaskHeaderPreview = (): React.JSX.Element => (
  <PreviewCard>
    <div className={styles.crumbs}>
      <JavaScriptIcon size={14} />
      <span>JavaScript</span>
      <ChevronRight size={12} />
      <span>{DEBOUNCE_TASK.group}</span>
      <ChevronRight size={12} />
      <span className={styles.crumbCurrent}>{DEBOUNCE_TASK.subgroup}</span>
    </div>
    <h3 className={styles.taskTitle}>{DEBOUNCE_TASK.title}</h3>
    <TaskMetaBadges task={DEBOUNCE_TASK} className={styles.taskBadges} />
    <div className={styles.taskFooter}>
      <span className={styles.runHint}>
        <UiKbd keys={["⌘", "↵"]} size="sm" />
        запуск
      </span>
      <span className={styles.solvedChip}>
        <CheckCircle2 size={13} />
        Решено
      </span>
    </div>
  </PreviewCard>
);
