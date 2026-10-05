import React from "react";
import { clsx } from "clsx";
import { ArrowRight } from "lucide-react";
import { UiReveal, UiScaledCanvas, type UiRevealOrder } from "@/shared/ui";
import { LANDING_SECTION } from "../../config/landingLinks";
import { useCreateAccountDialog } from "../../model/createAccountDialog";
import { SplitRunnerPreview } from "../previews/SplitRunnerPreview";
import { SectionHeading } from "../SectionHeading/SectionHeading";
import { TextHighlight } from "../TextHighlight/TextHighlight";
import { ScrollCue } from "../ScrollCue/ScrollCue";
import scene from "../scene.module.css";
import styles from "./RunnerSection.module.css";

const RUNNER_POINTS = [
  {
    title: "Сплит-экран с ресайзом",
    text: "Перетащи разделитель между кодом и интерфейсом - пропорции сохранятся для следующих задач.",
  },
  {
    title: "Песочница кандидата",
    text: "Живой код с типичными багами и антипаттернами: тренируй Code Review, как на реальном интервью.",
  },
  {
    title: "Визуализация алгоритмов",
    text: "2D/3D-визуализатор на Three.js показывает каждый шаг Two Pointers, Sliding Window и обходов графов.",
  },
] as const;

const POINT_ORDER: readonly UiRevealOrder[] = [3, 4, 5];

export const RunnerSection = (): React.JSX.Element => {
  const openDialog = useCreateAccountDialog((state) => state.open);

  return (
    <section
      id={LANDING_SECTION.runner}
      className={clsx(styles.section, scene.scene)}
      aria-labelledby="landing-runner-title"
    >
      <div className={scene.body}>
        <div className={styles.layout}>
          <UiReveal variant="scale">
            <div className={clsx(styles.visual, scene.depthFast)}>
              <UiScaledCanvas width={680} height={520}>
                <SplitRunnerPreview />
              </UiScaledCanvas>
            </div>
          </UiReveal>

          <div className={styles.copy}>
            <SectionHeading
              align="start"
              titleId="landing-runner-title"
              title={
                <>
                  Компонент <TextHighlight>оживает</TextHighlight> на каждой правке
                </>
              }
              lead="Сплит-режим 70/30: код слева, работающий интерфейс справа. Изолированная iframe-песочница собирает TSX и CSS, поддерживает React 19, Zustand и Redux Toolkit, а логи стримятся во встроенную консоль."
            />
            <ul className={styles.points}>
              {RUNNER_POINTS.map((point, index) => (
                <li key={point.title}>
                  <UiReveal order={POINT_ORDER[index]}>
                    <div className={styles.point}>
                      <h3 className={styles.pointTitle}>{point.title}</h3>
                      <p className={styles.pointText}>{point.text}</p>
                    </div>
                  </UiReveal>
                </li>
              ))}
            </ul>
            <UiReveal order={6}>
              <button
                type="button"
                className={styles.link}
                onClick={() => openDialog({ path: "/editor", label: "песочница" })}
              >
                Открыть песочницу
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </UiReveal>
          </div>
        </div>
      </div>
      <ScrollCue targetId="start" label="Начать" />
    </section>
  );
};
