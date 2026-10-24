import React from "react";
import { Link } from "@tanstack/react-router";
import { clsx } from "clsx";
import { getToneClass, type SkillDefinition, type SkillTaskProgress } from "@/entities/skill";
import {
  SKILL_TASK_ICONS,
  getSkillTaskHref,
  getSkillTaskLabel,
  getSkillTaskTone,
} from "../../lib/skillTaskMeta";
import styles from "./SkillDetailPanel.module.css";

export interface SkillTaskListProps {
  skill: SkillDefinition;
  tasks: readonly SkillTaskProgress[];
}

const TaskRow = ({ task }: { task: SkillTaskProgress }): React.JSX.Element => {
  const Icon = SKILL_TASK_ICONS[task.state];
  return (
    <li>
      <Link
        to={getSkillTaskHref(task.id)}
        className={clsx(styles.taskRow, getToneClass(getSkillTaskTone(task.state)))}
      >
        <Icon size={15} aria-hidden="true" className={styles.taskIcon} />
        <span className={styles.taskText}>
          <span className={styles.taskTitle}>{task.title}</span>
          <span className={styles.taskMeta}>{getSkillTaskLabel(task)}</span>
        </span>
      </Link>
    </li>
  );
};

/** Tasks in route order, grouped by step when the skill has several. */
export const SkillTaskList = ({ skill, tasks }: SkillTaskListProps): React.JSX.Element => {
  if (skill.steps.length < 2) {
    return (
      <ul className={styles.taskList}>
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </ul>
    );
  }

  return (
    <div className={styles.steps}>
      {skill.steps.map((step, index) => {
        const stepTasks = tasks.filter((task) => task.step === index);
        const started = stepTasks.filter((task) => task.evidence !== null).length;
        return (
          <section key={step.title} className={styles.step}>
            <h4 className={styles.stepTitle}>
              <span>{step.title}</span>
              <span className={styles.stepCount}>
                {started}/{stepTasks.length}
              </span>
            </h4>
            <ul className={styles.taskList}>
              {stepTasks.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
};
