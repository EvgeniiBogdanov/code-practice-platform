import React, { memo } from "react";
import { FolderGit2, Zap, Code2, Brain } from "lucide-react";
import { HomeStats } from "../model/use-home-stats";
import { HomeSectionCard } from "./HomeSectionCard";
import styles from "./HomePage.module.css";

interface HomePracticeSectionsProps {
  stats: HomeStats;
}

export const HomePracticeSections = memo(
  ({ stats }: HomePracticeSectionsProps): React.JSX.Element => {
    return (
      <div className={styles.sectionBlock}>
        <div className={styles.blockHeader}>
          <FolderGit2 size={16} color="var(--accent-blue, #3b82f6)" className={styles.blockIcon} />
          <h2 className={styles.blockTitle}>Разделы практики</h2>
        </div>

        <div className={styles.galleryGrid}>
          <HomeSectionCard
            coverClass={styles.amberCover}
            coverIcon={<Zap size={24} color="#f59e0b" />}
            title="JavaScript"
            tagText={`${stats.jsTotal} задач`}
            tagClass={styles.tagAmber}
            description="Синтаксис и циклы, объекты и глубокие манипуляции, замыкания, функции высшего порядка, Event Loop, Promise, таймеры, контроль частоты и паттерны."
            tags={["#objects", "#async", "#closures", "#event-loop", "#promises"]}
            solved={stats.jsSolved}
            total={stats.jsTotal}
            pct={stats.jsPct}
            to="/javascript"
            actionBtnClass={styles.actionBtnAmber}
          />

          <HomeSectionCard
            coverClass={styles.blueCover}
            coverIcon={<Code2 size={24} color="#3b82f6" />}
            title="React"
            tagText={`${stats.reactTotal} задач`}
            tagClass={styles.tagBlue}
            description="Паттерны хуков React 19, рефакторинг компонентов, оптимизация перерендеров, состояние с Zustand и Redux Toolkit, живой запуск и TypeScript."
            tags={["#react19", "#hooks", "#refactoring", "#typescript"]}
            solved={stats.reactSolved}
            total={stats.reactTotal}
            pct={stats.reactPct}
            to="/react"
            actionBtnClass={styles.actionBtnBlue}
          />

          <HomeSectionCard
            coverClass={styles.purpleCover}
            coverIcon={<Brain size={24} color="#a855f7" />}
            title="Алгоритмы"
            tagText={`${stats.algoTotal} задач`}
            tagClass={styles.tagPurple}
            description="Классические алгоритмические задачи с собеседований: два указателя, скользящее окно, бинарный поиск, графы и деревья с анализом O(N) / O(1)."
            tags={["#two-pointers", "#sliding-window", "#binary-search"]}
            solved={stats.algoSolved}
            total={stats.algoTotal}
            pct={stats.algoPct}
            to="/algorithms"
            actionBtnClass={styles.actionBtnPurple}
          />
        </div>
      </div>
    );
  }
);

HomePracticeSections.displayName = "HomePracticeSections";
