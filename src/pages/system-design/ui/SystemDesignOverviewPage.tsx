import React from "react";
import { FlaskConical } from "lucide-react";
import { Callout } from "@/shared/ui";
import type { DesignCase } from "@/entities/design-case";
import { DESIGN_TOPICS } from "@/entities/design-topic";
import { useTaskSection } from "@/entities/task/catalog";
import { CaseCards } from "./CaseCards";
import { DrillTable } from "./DrillTable";
import { TopicCards } from "./TopicCards";
import styles from "./SystemDesignOverviewPage.module.css";

export interface SystemDesignOverviewPageProps {
  cases: readonly DesignCase[];
}

export const SystemDesignOverviewPage = ({
  cases,
}: SystemDesignOverviewPageProps): React.JSX.Element => {
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

      <Callout
        color="amber"
        icon={<FlaskConical size={18} aria-hidden="true" />}
        title="MVP: ранняя версия раздела"
      >
        Раздел в активной разработке: впереди много работы, интерфейс пока сырой. Кейсов, тем и
        дриллов будет больше.
      </Callout>

      {isEmpty && <p className={styles.empty}>Материалы раздела скоро появятся.</p>}

      {DESIGN_TOPICS.length > 0 && (
        <section className={styles.block} aria-labelledby="sd-theory-title">
          <h2 id="sd-theory-title" className={styles.blockTitle}>
            Теория
          </h2>
          <TopicCards />
        </section>
      )}

      {cases.length > 0 && (
        <section className={styles.block} aria-labelledby="sd-cases-title">
          <h2 id="sd-cases-title" className={styles.blockTitle}>
            Кейсы
          </h2>
          <CaseCards cases={cases} />
        </section>
      )}

      {drills.length > 0 && (
        <section className={styles.block} aria-labelledby="sd-drills-title">
          <h2 id="sd-drills-title" className={styles.blockTitle}>
            Дриллы
          </h2>
          <DrillTable drills={drills} />
        </section>
      )}
    </div>
  );
};
