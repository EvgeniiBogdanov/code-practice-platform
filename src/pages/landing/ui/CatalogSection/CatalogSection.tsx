import React from "react";
import { ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import { CURRICULUM_COUNTS, SECTIONS_CONFIG, type SectionType } from "@/entities/task/meta";
import { Badge, type BadgeVariant } from "@/shared/ui";
import { LANDING_SECTION } from "../../config/landing-links";
import { TOTAL_TASK_COUNT, formatTaskCount } from "../../lib/format-task-count";
import { useCreateAccountDialog } from "../../model/create-account-dialog";
import { SectionHeading } from "../SectionHeading/SectionHeading";
import { TextHighlight } from "../TextHighlight/TextHighlight";
import { ScrollCue } from "../ScrollCue/ScrollCue";
import scene from "../scene.module.css";
import styles from "./CatalogSection.module.css";

interface CatalogEntry {
  id: SectionType;
  badge: BadgeVariant;
  description: string;
  topics: readonly string[];
}

const CATALOG: readonly CatalogEntry[] = [
  {
    id: "javascript",
    badge: "yellow",
    description:
      "Циклы и объекты, замыкания, функции высшего порядка, Event Loop, Promise и полифилы, таймеры, контроль частоты и паттерны проектирования.",
    topics: ["#closures", "#event-loop", "#promises", "#polyfills", "#patterns"],
  },
  {
    id: "typescript",
    badge: "ts",
    description:
      "От первых аннотаций до типизированного EventEmitter: обобщённые и служебные типы, преобразования типов, классы и прикладные паттерны.",
    topics: ["#generics", "#utility-types", "#mapped-types", "#type-safety"],
  },
  {
    id: "react",
    badge: "blue",
    description:
      "Хуки React 19, рефакторинг и лишние перерендеры, UI-паттерны, состояние на useReducer, Zustand и Redux Toolkit, жизненный цикл и типизация компонентов.",
    topics: ["#react19", "#hooks", "#refactoring", "#redux-toolkit"],
  },
  {
    id: "algorithms",
    badge: "purple",
    description:
      "Классика собеседований в 10 категориях: Two Pointers, Sliding Window, Binary Search, стек, графы и деревья — с разбором O(N) / O(1) и пошаговой визуализацией.",
    topics: ["#two-pointers", "#sliding-window", "#binary-search", "#dfs-bfs"],
  },
];

/** The track holds this many identical groups and slides by exactly one group, so the loop is seamless. */
const GROUP_COUNT = 3;
const GROUP_INDEXES: readonly number[] = Array.from({ length: GROUP_COUNT }, (_, index) => index);

export const CatalogSection = (): React.JSX.Element => {
  const openDialog = useCreateAccountDialog((state) => state.open);

  return (
    <section
      id={LANDING_SECTION.catalog}
      className={clsx(styles.section, scene.scene)}
      aria-labelledby="landing-catalog-title"
    >
      <div className={scene.body}>
        <SectionHeading
          titleId="landing-catalog-title"
          title={
            <>
              {formatTaskCount(TOTAL_TASK_COUNT)}, <TextHighlight>разложенных</TextHighlight> по
              темам
            </>
          }
          lead="От разминки до уровня Senior: каждая тема - это группа задач с теорией, материалами и собственным прогрессом."
        />

        <div className={styles.gallery}>
          <div className={styles.track}>
            {GROUP_INDEXES.map((group) => {
              // Only the first group is real content; the rest exist for the endless loop.
              const isClone = group > 0;
              return (
                <div key={group} className={styles.group} aria-hidden={isClone} inert={isClone}>
                  {CATALOG.map((entry) => {
                    const { icon: Icon, color, title, path } = SECTIONS_CONFIG[entry.id];
                    return (
                      <article
                        key={entry.id}
                        className={clsx(styles.card, styles[`card_${entry.id}`])}
                      >
                        <header className={styles.cardHeader}>
                          <span className={styles.iconBox}>
                            <Icon size={22} color={color} />
                          </span>
                          <h3 className={styles.cardTitle}>{title}</h3>
                          <Badge variant={entry.badge} size="sm" uppercase={false}>
                            {formatTaskCount(CURRICULUM_COUNTS[entry.id])}
                          </Badge>
                        </header>
                        <p className={styles.description}>{entry.description}</p>
                        <ul className={styles.topics}>
                          {entry.topics.map((topic) => (
                            <li key={topic} className={styles.topic}>
                              {topic}
                            </li>
                          ))}
                        </ul>
                        <button
                          type="button"
                          className={styles.open}
                          onClick={() => openDialog({ path, label: `раздел «${title}»` })}
                        >
                          Открыть раздел
                          <ArrowRight size={15} aria-hidden="true" />
                        </button>
                      </article>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <ScrollCue targetId="probability" label="Индекс вероятности" />
    </section>
  );
};
