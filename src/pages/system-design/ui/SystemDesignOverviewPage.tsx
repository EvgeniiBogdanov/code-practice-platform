import React from "react";
import { Link } from "@tanstack/react-router";
import { Badge, Card } from "@/shared/ui";
import { countCompletedStages, useDesignCaseStore, type DesignCase } from "@/entities/design-case";
import { DESIGN_TOPICS } from "@/entities/design-topic";
import { isTaskCompleted, useProgressStore } from "@/entities/progress";
import { useTaskSection } from "@/entities/task/catalog";
import { DIFFICULTY_BADGE } from "../lib/difficultyBadge";
import styles from "./SystemDesignOverviewPage.module.css";

export interface SystemDesignOverviewPageProps {
  cases: readonly DesignCase[];
}

export const SystemDesignOverviewPage = ({
  cases,
}: SystemDesignOverviewPageProps): React.JSX.Element => {
  const stagesProgress = useDesignCaseStore((state) => state.stages);
  const completedTasks = useProgressStore((state) => state.completedTasks);
  const { tasks: drills } = useTaskSection("system-design");
  const isEmpty = DESIGN_TOPICS.length === 0 && cases.length === 0 && drills.length === 0;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Системный дизайн</h1>
        <p className={styles.subtitle}>
          Теория, разборы кейсов в формате интервью и код-дриллы: от требований до оптимизаций.
        </p>
      </header>

      {isEmpty && <p className={styles.empty}>Материалы раздела скоро появятся.</p>}

      {DESIGN_TOPICS.length > 0 && (
        <section className={styles.block} aria-labelledby="sd-theory-title">
          <h2 id="sd-theory-title" className={styles.blockTitle}>
            Теория
          </h2>
          <div className={styles.grid}>
            {DESIGN_TOPICS.map((topic) => (
              <Link
                key={topic.id}
                to="/system-design/topics/$topicId"
                params={{ topicId: topic.id }}
                className={styles.cardLink}
              >
                <Card variant="interactive" className={styles.card}>
                  <h3 className={styles.cardTitle}>{topic.title}</h3>
                  <p className={styles.cardText}>{topic.summary}</p>
                  <span className={styles.cardMeta}>{topic.minutes} мин чтения</span>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {cases.length > 0 && (
        <section className={styles.block} aria-labelledby="sd-cases-title">
          <h2 id="sd-cases-title" className={styles.blockTitle}>
            Кейсы
          </h2>
          <div className={styles.grid}>
            {cases.map((designCase) => {
              const difficulty = DIFFICULTY_BADGE[designCase.difficulty];
              const done = countCompletedStages(designCase, stagesProgress);
              return (
                <Link
                  key={designCase.id}
                  to="/system-design/cases/$caseId"
                  params={{ caseId: designCase.id }}
                  className={styles.cardLink}
                >
                  <Card variant="interactive" className={styles.card}>
                    <div className={styles.cardHead}>
                      <h3 className={styles.cardTitle}>{designCase.title}</h3>
                      <Badge variant={difficulty.variant}>{difficulty.label}</Badge>
                    </div>
                    <p className={styles.cardText}>{designCase.summary}</p>
                    <span className={styles.cardMeta}>
                      Этапов пройдено: {done} из {designCase.stages.length}
                    </span>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {drills.length > 0 && (
        <section className={styles.block} aria-labelledby="sd-drills-title">
          <h2 id="sd-drills-title" className={styles.blockTitle}>
            Дриллы
          </h2>
          <ul className={styles.drills}>
            {drills.map((task) => (
              <li key={task.id}>
                <Link
                  to="/system-design/$taskId"
                  params={{ taskId: String(task.id) }}
                  className={styles.drillLink}
                >
                  <span>{task.title}</span>
                  {isTaskCompleted(completedTasks[String(task.id)]) && (
                    <Badge variant="green">Решено</Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
