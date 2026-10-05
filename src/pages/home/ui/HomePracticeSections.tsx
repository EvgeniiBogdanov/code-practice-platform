import React, { memo } from "react";
import { FolderGit2, Brain } from "lucide-react";
import { JavaScriptIcon, TypeScriptIcon, ReactIcon } from "@/shared/ui";
import { HomeStats } from "../model/useHomeStats";
import { HomeSectionCard } from "./HomeSectionCard";
import styles from "./HomePracticeSections.module.css";

interface HomePracticeSectionsProps {
  stats: HomeStats;
}

export const HomePracticeSections = memo(
  ({ stats }: HomePracticeSectionsProps): React.JSX.Element => {
    return (
      <div className={styles.sectionBlock}>
        <div className={styles.blockHeader}>
          <FolderGit2 size={22} color="var(--accent-blue, #3b82f6)" className={styles.blockIcon} />
          <h2 className={styles.blockTitle}>Разделы практики</h2>
        </div>

        <div className={styles.grid}>
          <HomeSectionCard
            icon={<JavaScriptIcon size={22} color="var(--color-js)" />}
            tone="javascript"
            title="JavaScript"
            tagText={`${stats.jsTotal} задач`}
            tagVariant="yellow"
            description="Синтаксис и циклы, объекты и глубокие манипуляции, замыкания, функции высшего порядка, Event Loop, Promise, таймеры, контроль частоты и паттерны."
            topics={["#objects", "#async", "#closures", "#event-loop", "#promises"]}
            solved={stats.jsSolved}
            total={stats.jsTotal}
            pct={stats.jsPct}
            to="/javascript"
          />

          <HomeSectionCard
            icon={<TypeScriptIcon size={22} />}
            tone="typescript"
            title="TypeScript"
            tagText={`${stats.tsTotal} задач`}
            tagVariant="ts"
            description="От первых аннотаций до типизированного EventEmitter: интерфейсы, обобщённые и служебные типы, преобразования типов, классы и прикладные паттерны."
            topics={["#typescript", "#generics", "#utility-types", "#type-safety"]}
            solved={stats.tsSolved}
            total={stats.tsTotal}
            pct={stats.tsPct}
            to="/typescript"
          />

          <HomeSectionCard
            icon={<ReactIcon size={22} />}
            tone="react"
            title="React"
            tagText={`${stats.reactTotal} задач`}
            tagVariant="blue"
            description="Паттерны хуков React 19, рефакторинг компонентов, оптимизация перерендеров, состояние с Zustand и Redux Toolkit, живой запуск и TypeScript."
            topics={["#react19", "#hooks", "#refactoring", "#typescript"]}
            solved={stats.reactSolved}
            total={stats.reactTotal}
            pct={stats.reactPct}
            to="/react"
          />

          <HomeSectionCard
            icon={<Brain size={22} color="var(--color-algo)" />}
            tone="algorithms"
            title="Алгоритмы"
            tagText={`${stats.algoTotal} задач`}
            tagVariant="purple"
            description="Классические алгоритмические задачи с собеседований: два указателя, скользящее окно, бинарный поиск, графы и деревья с анализом O(N) / O(1)."
            topics={["#two-pointers", "#sliding-window", "#binary-search"]}
            solved={stats.algoSolved}
            total={stats.algoTotal}
            pct={stats.algoPct}
            to="/algorithms"
          />
        </div>
      </div>
    );
  }
);

HomePracticeSections.displayName = "HomePracticeSections";
