import React from "react";
import { ArrowRight, ArrowUpRight, Lock } from "lucide-react";
import { clsx } from "clsx";
import { APP_VERSION } from "@/shared/config";
import { Button, GitHubIcon, buttonClassName } from "@/shared/ui";
import { REPOSITORY_URL } from "../../config/landing-links";
import { TOTAL_TASK_COUNT, formatTaskCount } from "../../lib/format-task-count";
import { useFloatDrift } from "../../lib/use-float-drift";
import { useCreateAccountDialog } from "../../model/create-account-dialog";
import { CommandPalettePreview } from "../previews/CommandPalettePreview";
import { ConsolePreview } from "../previews/ConsolePreview";
import { ReviewAssistantPreview } from "../previews/ReviewAssistantPreview";
import { SectionsProgressPreview } from "../previews/SectionsProgressPreview";
import { TaskHeaderPreview } from "../previews/TaskHeaderPreview";
import { ScrollCue } from "../ScrollCue/ScrollCue";
import { TextHighlight } from "../TextHighlight/TextHighlight";
import styles from "./HeroSection.module.css";

interface FloatingSlotProps {
  className: string;
  /** Decorative previews are inert (no focus, no screen reader noise); the slot still takes hover. */
  decorative?: boolean;
  /** Idle bobbing cycle in seconds; the offset keeps neighbouring cards out of sync. */
  period?: number;
  phase?: number;
  children: React.ReactNode;
}

const FloatingSlot = ({
  className,
  decorative = false,
  period = 8,
  phase = 0,
  children,
}: FloatingSlotProps): React.JSX.Element => {
  const driftRef = useFloatDrift<HTMLDivElement>(period, phase);
  return (
    <div className={clsx(styles.slot, className)}>
      <div className={styles.tilt}>
        <div ref={driftRef} className={styles.float}>
          <div className={styles.pop} inert={decorative}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const HeroSection = (): React.JSX.Element => {
  const openDialog = useCreateAccountDialog((state) => state.open);

  return (
    <section className={styles.hero} aria-labelledby="landing-hero-title">
      <div className={styles.inner}>
        <div className={styles.stage}>
          <div className={styles.copy}>
            <a
              className={styles.eyebrow}
              href={REPOSITORY_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.eyebrowVersion}>
                <span className={styles.pulseDot} aria-hidden="true" />v{APP_VERSION}
              </span>
              <span>Open Source · {formatTaskCount(TOTAL_TASK_COUNT)}, которые ждут тебя</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>

            <h1 id="landing-hero-title" className={styles.headline}>
              <span className={styles.line}>
                <span className={clsx(styles.chunk, styles.chunk1)}>Практика, которая</span>
              </span>{" "}
              <span className={styles.line}>
                <span className={clsx(styles.chunk, styles.chunk2)}>
                  <TextHighlight withCaret>держит тебя</TextHighlight>
                </span>
              </span>{" "}
              <span className={styles.line}>
                <span className={clsx(styles.chunk, styles.chunk3)}>в</span>{" "}
                <span className={clsx(styles.chunk, styles.chunk4)}>форме</span>
              </span>
            </h1>

            <p className={styles.lead}>
              Готовься не только к собеседованиям, но и держи свои навыки в тонусе каждый день:{" "}
              {formatTaskCount(TOTAL_TASK_COUNT)}, которые можно встретить на реальных интервью по
              JavaScript, TypeScript, React и алгоритмам - в собственном редакторе уровня VS Code, с
              эталонными решениями и интервальными повторениями, которые не дают знаниям
              выветриться.
            </p>

            <div className={styles.actions}>
              <Button
                variant="primary"
                size="xl"
                rightIcon={<ArrowRight size={18} />}
                onClick={() => openDialog()}
              >
                Создать локальный аккаунт
              </Button>
              <a
                className={buttonClassName({ variant: "outline", size: "xl" })}
                href={REPOSITORY_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon size={18} />
                Исходный код
              </a>
            </div>

            <p className={styles.note}>
              <Lock size={14} aria-hidden="true" />
              Только имя - без почты, пароля и серверов
            </p>
          </div>

          <div className={styles.artifacts}>
            <FloatingSlot className={styles.slotTask} decorative period={8}>
              <TaskHeaderPreview />
            </FloatingSlot>
            <FloatingSlot className={styles.slotReview} decorative period={9} phase={3}>
              <ReviewAssistantPreview />
            </FloatingSlot>
            <FloatingSlot className={styles.slotConsole} decorative period={10} phase={6}>
              <ConsolePreview />
            </FloatingSlot>
            <FloatingSlot className={styles.slotSections} decorative period={9.5} phase={1.5}>
              <SectionsProgressPreview />
            </FloatingSlot>
            <FloatingSlot className={styles.slotPalette} period={7} phase={4}>
              <CommandPalettePreview />
            </FloatingSlot>
          </div>
        </div>
      </div>
      <ScrollCue targetId="practice" label="Цикл подготовки" />
    </section>
  );
};
