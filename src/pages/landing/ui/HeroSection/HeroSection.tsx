import React, { useMemo } from "react";
import { ArrowRight, ArrowUpRight, Lock } from "lucide-react";
import { clsx } from "clsx";
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { APP_VERSION } from "@/shared/config";
import { useInView } from "@/shared/lib/hooks";
import { Button, GitHubIcon, buttonClassName } from "@/shared/ui";
import { REPOSITORY_URL } from "../../config/landingLinks";
import { TOTAL_TASK_COUNT, formatTaskCount } from "../../lib/formatTaskCount";
import { useHoverMagnet } from "../../lib/useHoverMagnet";
import { useCreateAccountDialog } from "../../model/createAccountDialog";
import { CommandPalettePreview } from "../previews/CommandPalettePreview";
import { ConsolePreview } from "../previews/ConsolePreview";
import { ReviewAssistantPreview } from "../previews/ReviewAssistantPreview";
import { SectionsProgressPreview } from "../previews/SectionsProgressPreview";
import { TaskHeaderPreview } from "../previews/TaskHeaderPreview";
import { ScrollCue } from "../ScrollCue/ScrollCue";
import { TextHighlight } from "../TextHighlight/TextHighlight";
import {
  ARTIFACTS_VARIANTS,
  CARD_VARIANTS,
  COPY_VARIANTS,
  RISE_VARIANTS,
  WORD_VARIANTS,
  getFloatVariants,
} from "./heroMotion";
import styles from "./HeroSection.module.css";

/** How far (px) a hovered card leans towards the pointer at its edge. */
const MAGNET_PX = 10;

interface FloatingSlotProps {
  className: string;
  /** Decorative previews are inert (no focus, no screen reader noise); the slot still takes hover. */
  decorative?: boolean;
  /** Idle bobbing cycle in seconds; the offset keeps neighbouring cards out of sync. */
  period?: number;
  phase?: number;
  children: React.ReactNode;
}

/**
 * Layers, each owning one kind of motion so they never fight over `transform`:
 * slot (CSS scroll parallax via `translate`, takes the hover) → hover magnet → resting tilt and lift (CSS) →
 * entrance spring → idle float (WAAPI loop on the compositor, only while the card is on screen).
 */
const FloatingSlot = ({
  className,
  decorative = false,
  period = 8,
  phase = 0,
  children,
}: FloatingSlotProps): React.JSX.Element => {
  const isReduced = useReducedMotion();
  const [floatRef, isOnScreen] = useInView<HTMLDivElement>({
    threshold: 0,
    rootMargin: "0px",
    once: false,
  });
  const floatVariants = useMemo(() => getFloatVariants(period, phase), [period, phase]);
  const { x, y, onPointerMove, onPointerLeave } = useHoverMagnet(MAGNET_PX);

  return (
    <div
      className={clsx(styles.slot, className)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {/* Motion values bind through `style`: they update the DOM directly, without React renders. */}
      <m.div className={styles.magnet} style={{ x, y }}>
        <div className={styles.tilt}>
          <m.div className={styles.pop} variants={CARD_VARIANTS}>
            <m.div
              ref={floatRef}
              variants={floatVariants}
              initial={false}
              animate={isOnScreen && !isReduced ? "float" : "rest"}
              inert={decorative}
            >
              {children}
            </m.div>
          </m.div>
        </div>
      </m.div>
    </div>
  );
};

interface HeadlineWordProps {
  children: React.ReactNode;
}

/** A headline chunk that slides up out of its own clipping mask. */
const HeadlineWord = ({ children }: HeadlineWordProps): React.JSX.Element => (
  <span className={styles.mask}>
    <m.span className={styles.word} variants={WORD_VARIANTS}>
      {children}
    </m.span>
  </span>
);

export const HeroSection = (): React.JSX.Element => {
  const openDialog = useCreateAccountDialog((state) => state.open);

  return (
    <section className={styles.hero} aria-labelledby="landing-hero-title">
      <div className={styles.inner}>
        <div className={styles.stage}>
          <m.div className={styles.copy} variants={COPY_VARIANTS} initial="hidden" animate="shown">
            <m.a
              variants={RISE_VARIANTS}
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
            </m.a>

            <h1 id="landing-hero-title" className={styles.headline}>
              <span className={styles.line}>
                <HeadlineWord>Практика,</HeadlineWord> <HeadlineWord>которая</HeadlineWord>
              </span>{" "}
              <span className={styles.line}>
                <HeadlineWord>
                  <TextHighlight withCaret>держит тебя</TextHighlight>
                </HeadlineWord>
              </span>{" "}
              <span className={styles.line}>
                <HeadlineWord>в</HeadlineWord> <HeadlineWord>форме</HeadlineWord>
              </span>
            </h1>

            <m.p className={styles.lead} variants={RISE_VARIANTS}>
              Готовься не только к собеседованиям, но и держи свои навыки в тонусе каждый день:{" "}
              {formatTaskCount(TOTAL_TASK_COUNT)}, которые можно встретить на реальных интервью по
              JavaScript, TypeScript, React и алгоритмам - в собственном редакторе уровня VS Code, с
              эталонными решениями и интервальными повторениями, которые не дают знаниям
              выветриться.
            </m.p>

            <m.div className={styles.actions} variants={RISE_VARIANTS}>
              <Button
                variant="primary"
                size="xl"
                shape="pill"
                rightIcon={<ArrowRight size={18} />}
                onClick={() => openDialog()}
              >
                Создать локальный аккаунт
              </Button>
              <a
                className={buttonClassName({ variant: "outline", size: "xl", shape: "pill" })}
                href={REPOSITORY_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon size={18} />
                Исходный код
              </a>
            </m.div>

            <m.p className={styles.note} variants={RISE_VARIANTS}>
              <Lock size={14} aria-hidden="true" />
              Только имя - без почты, пароля и серверов
            </m.p>
          </m.div>

          <m.div
            className={styles.artifacts}
            variants={ARTIFACTS_VARIANTS}
            initial="hidden"
            animate="shown"
          >
            <FloatingSlot className={styles.slotTask} decorative period={8}>
              <TaskHeaderPreview />
            </FloatingSlot>
            <FloatingSlot className={styles.slotReview} decorative period={9} phase={0.8}>
              <ReviewAssistantPreview />
            </FloatingSlot>
            <FloatingSlot className={styles.slotConsole} decorative period={10} phase={1.6}>
              <ConsolePreview />
            </FloatingSlot>
            <FloatingSlot className={styles.slotSections} decorative period={9.5} phase={0.4}>
              <SectionsProgressPreview />
            </FloatingSlot>
            <FloatingSlot className={styles.slotPalette} period={7} phase={1.2}>
              <CommandPalettePreview />
            </FloatingSlot>
          </m.div>
        </div>
      </div>
      <ScrollCue targetId="practice" label="Цикл подготовки" />
    </section>
  );
};
