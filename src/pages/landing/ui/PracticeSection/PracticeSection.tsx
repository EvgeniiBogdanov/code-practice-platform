import React, { useState } from "react";
import { clsx } from "clsx";
import { useInView } from "@/shared/lib/hooks";
import { UiReveal, UiScaledCanvas } from "@/shared/ui";
import { LANDING_SECTION } from "../../config/landing-links";
import { ReviewStatsPreview } from "../previews/ReviewStatsPreview";
import { SolutionPreview } from "../previews/SolutionPreview";
import { WorkspacePreview, type PracticePreviewProps } from "../previews/WorkspacePreview";
import { SectionHeading } from "../SectionHeading/SectionHeading";
import { TextHighlight } from "../TextHighlight/TextHighlight";
import { ScrollCue } from "../ScrollCue/ScrollCue";
import scene from "../scene.module.css";
import styles from "./PracticeSection.module.css";

interface PracticeStep {
  id: string;
  title: string;
  body: string;
  Preview: (props: PracticePreviewProps) => React.JSX.Element;
}

const PRACTICE_STEPS: readonly PracticeStep[] = [
  {
    id: "solve",
    title: "Решай как на интервью",
    body: "Условие, заготовка и запуск по ⌘ + Enter. Встроенная консоль, проверка синтаксиса и таймер собеседования — всё, что ждёт на настоящем live coding.",
    Preview: WorkspacePreview,
  },
  {
    id: "compare",
    title: "Сверяйся с эталоном",
    body: "Оптимальные решения O(N) / O(1) с альтернативными подходами, разбором подводных камней, вопросами интервьюера и чек-листом самопроверки.",
    Preview: SolutionPreview,
  },
  {
    id: "retain",
    title: "Закрепляй повторениями",
    body: "Интервальный помощник сам планирует повторы через 1 → 3 → 7 → 14 → 30 дней, напоминает о просрочках и показывает, что уже доведено до мастерства.",
    Preview: ReviewStatsPreview,
  },
];

export const PracticeSection = (): React.JSX.Element => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [layoutRef, isInView] = useInView<HTMLDivElement>({
    threshold: 0.3,
    rootMargin: "0px",
    once: false,
  });
  // Auto-rotation pauses for pointer and keyboard users alike (WCAG 2.2.2).
  const isRunning = isInView && !isHovered && !hasFocus;

  const showNextStep = (): void => {
    setActiveIndex((index) => (index + 1) % PRACTICE_STEPS.length);
  };

  return (
    <section
      id={LANDING_SECTION.practice}
      className={clsx(styles.section, scene.scene)}
      aria-labelledby="landing-practice-title"
    >
      <div className={scene.body}>
        <SectionHeading
          titleId="landing-practice-title"
          title={
            <>
              Решил. Сверил. <TextHighlight>Закрепил.</TextHighlight>
            </>
          }
          lead="Каждая задача проходит полный цикл - от первой попытки до уверенного ответа через месяц."
        />

        <div
          ref={layoutRef}
          className={styles.layout}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setHasFocus(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setHasFocus(false);
          }}
        >
          <UiReveal>
            <div className={styles.steps}>
              {PRACTICE_STEPS.map((step, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={step.id}
                    type="button"
                    className={clsx(styles.step, isActive && styles.stepActive)}
                    aria-expanded={isActive}
                    onClick={() => setActiveIndex(index)}
                  >
                    <span className={styles.track} aria-hidden="true">
                      {isActive && (
                        <span
                          key={`${activeIndex}-${String(isInView)}`}
                          className={clsx(styles.progress, !isRunning && styles.progressPaused)}
                          onAnimationEnd={showNextStep}
                        />
                      )}
                    </span>
                    <span className={styles.stepIndex}>0{index + 1}</span>
                    <span className={styles.stepTitle}>{step.title}</span>
                    <span className={styles.stepBody}>
                      <span className={styles.stepClip}>
                        <span className={styles.stepText}>{step.body}</span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </UiReveal>

          <UiReveal variant="scale" order={1}>
            <div className={clsx(styles.visual, scene.depthFast)} aria-hidden="true">
              <UiScaledCanvas width={640} height={500}>
                {PRACTICE_STEPS.map(({ id, Preview }, index) => (
                  <div
                    key={id}
                    className={clsx(styles.layer, index === activeIndex && styles.layerActive)}
                    inert
                  >
                    <Preview isActive={isInView && index === activeIndex} />
                  </div>
                ))}
              </UiScaledCanvas>
            </div>
          </UiReveal>
        </div>
      </div>
      <ScrollCue targetId="catalog" label="Каталог задач" />
    </section>
  );
};
