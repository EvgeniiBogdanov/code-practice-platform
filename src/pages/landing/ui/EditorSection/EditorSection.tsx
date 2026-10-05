import React from "react";
import { clsx } from "clsx";
import { ArrowUpRight } from "lucide-react";
import { useInView } from "@/shared/lib/hooks";
import { UiKbd, UiReveal, UiScaledCanvas, type UiRevealOrder } from "@/shared/ui";
import { HOTKEYS_URL, LANDING_SECTION } from "../../config/landingLinks";
import { MultiCursorPreview } from "../previews/MultiCursorPreview";
import { SectionHeading } from "../SectionHeading/SectionHeading";
import { TextHighlight } from "../TextHighlight/TextHighlight";
import { ScrollCue } from "../ScrollCue/ScrollCue";
import scene from "../scene.module.css";
import styles from "./EditorSection.module.css";

interface EditorFeature {
  title: string;
  keys: readonly string[];
  text: string;
}

const EDITOR_FEATURES: readonly EditorFeature[] = [
  {
    title: "Мультикурсоры",
    keys: ["⌘", "D"],
    text: "Выделяет следующее совпадение, а ⌘ ⇧ L — сразу все вхождения слова.",
  },
  {
    title: "Перемещение строк",
    keys: ["⌥", "↑", "↓"],
    text: "Двигает и дублирует строки и целые блоки без мыши и копипасты.",
  },
  {
    title: "Emmet и автотеги",
    keys: ["Tab"],
    text: "ul>li*3 разворачивается в разметку, а теги HTML и JSX закрываются сами.",
  },
  {
    title: "Prettier и IntelliSense",
    keys: ["⇧", "⌥", "F"],
    text: "Форматирование Prettier 3 и контекстные подсказки по ⌃ Space.",
  },
];

const FEATURE_ORDER: readonly UiRevealOrder[] = [0, 1, 2, 3];

export const EditorSection = (): React.JSX.Element => {
  const [visualRef, isVisualInView] = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section
      id={LANDING_SECTION.editor}
      className={clsx(styles.section, scene.scene)}
      aria-labelledby="landing-editor-title"
    >
      <div className={scene.body}>
        <div className={styles.container}>
          <div className={styles.intro}>
            <SectionHeading
              align="start"
              titleId="landing-editor-title"
              title={
                <>
                  Привычные горячие клавиши как в VS Code -{" "}
                  <TextHighlight>прямо в браузере</TextHighlight>
                </>
              }
            />
            <UiReveal order={2}>
              <p className={styles.lead}>
                Никаких установок и настроек: редактор понимает JavaScript, TypeScript, JSX, HTML и
                CSS и ведёт себя так, как уже привыкли руки.
              </p>
            </UiReveal>
          </div>

          <div className={styles.layout}>
            <UiReveal>
              <div className={styles.aside}>
                <p className={styles.asideText}>
                  Мультикурсоры, Emmet, IntelliSense, проверка типов TypeScript и Prettier 3 - без
                  них live coding превращается в борьбу с редактором вместо решения задачи.
                </p>
                <a
                  className={styles.arrowLink}
                  href={HOTKEYS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Все горячие клавиши
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </div>
            </UiReveal>

            <UiReveal variant="scale" order={1}>
              <div
                ref={visualRef}
                className={clsx(styles.visual, scene.depthFast)}
                aria-hidden="true"
                inert
              >
                <UiScaledCanvas width={640} height={420}>
                  <MultiCursorPreview isActive={isVisualInView} />
                </UiScaledCanvas>
              </div>
            </UiReveal>
          </div>

          <ul className={styles.features}>
            {EDITOR_FEATURES.map((feature, index) => (
              <li key={feature.title}>
                <UiReveal order={FEATURE_ORDER[index]}>
                  <div className={styles.feature}>
                    <div className={styles.featureHead}>
                      <h3 className={styles.featureTitle}>{feature.title}</h3>
                      <UiKbd keys={feature.keys} size="sm" />
                    </div>
                    <p className={styles.featureText}>{feature.text}</p>
                  </div>
                </UiReveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ScrollCue targetId="runner" label="Живой запуск" />
    </section>
  );
};
