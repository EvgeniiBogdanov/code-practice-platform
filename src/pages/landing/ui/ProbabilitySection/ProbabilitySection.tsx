import React from "react";
import { clsx } from "clsx";
import { ArrowRight } from "lucide-react";
import { useInView } from "@/shared/lib/hooks";
import { GaugeIndicator, UiReveal } from "@/shared/ui";
import { LANDING_SECTION } from "../../config/landingLinks";
import { useCreateAccountDialog } from "../../model/createAccountDialog";
import { ProbabilityBoard } from "../previews/ProbabilityBoard";
import { TextHighlight } from "../TextHighlight/TextHighlight";
import { ScrollCue } from "../ScrollCue/ScrollCue";
import scene from "../scene.module.css";
import styles from "./ProbabilitySection.module.css";

/** Probability tiers as the workspace tooltips describe them. */
const PROBABILITY_TIERS = [
  { value: 20, label: "до 50% - разминка" },
  { value: 62, label: "50–75% - практическая задача" },
  { value: 82, label: "75–90% - частый вопрос" },
  { value: 96, label: "90%+ - стандарт live coding" },
] as const;

export const ProbabilitySection = (): React.JSX.Element => {
  const openDialog = useCreateAccountDialog((state) => state.open);
  const [boardRef, isBoardInView] = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section
      id={LANDING_SECTION.probability}
      className={clsx(styles.section, scene.scene)}
      aria-labelledby="landing-probability-title"
    >
      <div className={scene.body}>
        <UiReveal variant="scale">
          <div className={styles.layout}>
            <div className={styles.copy}>
              <h2 id="landing-probability-title" className={styles.title}>
                Знай заранее, <TextHighlight>что спросят</TextHighlight>
              </h2>
              <p className={styles.text}>
                У каждой задачи есть оценка вероятности встретить её на live coding уровня Middle и
                Senior - по практике BigTech, FinTech и E-commerce. Начинай с того, что спрашивают
                чаще всего, а мета-бейджи подскажут тип задачи: алгоритм, паттерн, полифил или
                утилита.
              </p>
              <ul className={styles.tiers}>
                {PROBABILITY_TIERS.map((tier) => (
                  <li key={tier.value} className={styles.tier}>
                    <GaugeIndicator value={tier.value} size={18} aria-label={tier.label} />
                    {tier.label}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={styles.link}
                onClick={() => openDialog({ path: "/javascript", label: "раздел «JavaScript»" })}
              >
                Начать с самых частых задач
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>

            <div ref={boardRef} className={clsx(styles.visual, scene.depthFast)}>
              <ProbabilityBoard isActive={isBoardInView} />
            </div>
          </div>
        </UiReveal>
      </div>
      <ScrollCue targetId="editor" label="Редактор кода" />
    </section>
  );
};
