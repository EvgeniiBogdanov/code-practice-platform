import React, { useEffect, useMemo, useRef, useState } from "react";
import { CornerDownLeft, Search } from "lucide-react";
import { clsx } from "clsx";
import { SECTIONS_CONFIG } from "@/entities/task/meta";
import { GaugeIndicator, UiKbd } from "@/shared/ui";
import {
  SHOWCASE_TASKS,
  getShowcaseTaskPath,
  type ShowcaseTask,
} from "../../config/showcase-tasks";
import { TOTAL_TASK_COUNT } from "../../lib/format-task-count";
import { getShowcaseProbability } from "../../lib/showcase-probability";
import { useTypewriter } from "../../lib/use-typewriter";
import { useCreateAccountDialog } from "../../model/create-account-dialog";
import { PreviewCard } from "./PreviewCard";
import styles from "./HeroPreviews.module.css";

const DEMO_QUERIES = ["promise", "debounce", "two sum", "eventemitter"] as const;
const MAX_RESULTS = 3;

const searchShowcaseTasks = (query: string): readonly ShowcaseTask[] => {
  const needle = query.trim().toLowerCase();
  if (!needle) return SHOWCASE_TASKS;
  return SHOWCASE_TASKS.filter((task) =>
    `${task.title} ${task.group} ${SECTIONS_CONFIG[task.section].title}`
      .toLowerCase()
      .includes(needle)
  );
};

/** Interactive Command Palette (⌘K): picking a task opens sign-up and then that very task. */
export const CommandPalettePreview = (): React.JSX.Element => {
  const openDialog = useCreateAccountDialog((state) => state.open);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const isDemo = !isFocused && query === "";
  const demoQuery = useTypewriter(DEMO_QUERIES, isDemo);
  const visibleQuery = isDemo ? demoQuery : query;
  const results = useMemo(
    () => searchShowcaseTasks(visibleQuery).slice(0, MAX_RESULTS),
    [visibleQuery]
  );
  const selectedIndex = Math.min(activeIndex, Math.max(results.length - 1, 0));

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent): void => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const openTask = (task: ShowcaseTask): void => {
    openDialog({ path: getShowcaseTaskPath(task), label: task.title });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((selectedIndex + step + results.length) % Math.max(results.length, 1));
    } else if (event.key === "Enter" && results[selectedIndex]) {
      event.preventDefault();
      openTask(results[selectedIndex]);
    } else if (event.key === "Escape") {
      event.currentTarget.blur();
    }
  };

  return (
    <PreviewCard className={styles.paletteCard}>
      <label className={styles.paletteSearch}>
        <Search size={16} aria-hidden="true" />
        <input
          ref={inputRef}
          className={styles.paletteInput}
          value={visibleQuery}
          placeholder="Найти задачу…"
          aria-label="Поиск задач — демо Command Palette"
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
        />
        <UiKbd keys={["⌘", "K"]} size="sm" />
      </label>

      <ul className={styles.paletteResults}>
        {results.map((task, index) => {
          const section = SECTIONS_CONFIG[task.section];
          const probability = getShowcaseProbability(task)?.probability ?? null;
          return (
            <li key={task.id}>
              <button
                type="button"
                className={clsx(
                  styles.paletteItem,
                  index === selectedIndex && styles.paletteActive
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => openTask(task)}
              >
                <section.icon size={15} color={section.color} />
                <span className={styles.paletteTitle}>{task.title}</span>
                <span className={styles.paletteMeta}>
                  {probability !== null && <GaugeIndicator value={probability} size={13} />}
                  {probability !== null ? `${probability}%` : section.title}
                </span>
                <CornerDownLeft size={12} className={styles.paletteEnter} aria-hidden="true" />
              </button>
            </li>
          );
        })}
        {results.length === 0 && (
          <li className={styles.paletteEmpty}>
            В демо всего несколько задач — в платформе поиск идёт по всем {TOTAL_TASK_COUNT}.
          </li>
        )}
      </ul>
    </PreviewCard>
  );
};
