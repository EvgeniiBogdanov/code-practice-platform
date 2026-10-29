import React, { useId } from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, Check, ChevronRight, Code2 } from "lucide-react";
import { TopicIconBox, type TopicIconBoxColor } from "@/shared/ui";
import styles from "./StageLinks.module.css";

export interface StageDrillLink {
  id: string;
  title: string;
  solved: boolean;
}

export interface StageTopicLink {
  id: string;
  title: string;
}

export interface StageLinksProps {
  topics: readonly StageTopicLink[];
  drills: readonly StageDrillLink[];
}

const ICON_SIZE = 16;

const drillMeta = (drill: StageDrillLink): string =>
  drill.solved ? "Код-дрилл · решён" : "Код-дрилл";

interface LinkContentProps {
  icon: React.ReactNode;
  color: TopicIconBoxColor;
  title: string;
  meta: string;
}

const LinkContent = ({ icon, color, title, meta }: LinkContentProps): React.JSX.Element => (
  <>
    <TopicIconBox size="sm" colorVariant={color} hoverable={false} aria-hidden="true">
      {icon}
    </TopicIconBox>
    <span className={styles.text}>
      <span className={styles.title}>{title}</span>
      <span className={styles.meta}>{meta}</span>
    </span>
    <ChevronRight className={styles.chevron} size={ICON_SIZE} aria-hidden="true" />
  </>
);

/** Theory to read before the stage and code drills that practise it. */
export const StageLinks = ({ topics, drills }: StageLinksProps): React.JSX.Element | null => {
  const headingId = useId();
  if (topics.length === 0 && drills.length === 0) return null;

  return (
    <nav className={styles.block} aria-labelledby={headingId}>
      <h3 id={headingId} className={styles.heading}>
        Подготовка к этапу
      </h3>
      <ul className={styles.list}>
        {topics.map((topic) => (
          <li key={topic.id}>
            <Link
              to="/system-design/topics/$topicId"
              params={{ topicId: topic.id }}
              className={styles.link}
              aria-label={`${topic.title} — Теория`}
            >
              <LinkContent
                icon={<BookOpen size={ICON_SIZE} />}
                color="purple"
                title={topic.title}
                meta="Теория"
              />
            </Link>
          </li>
        ))}
        {drills.map((drill) => (
          <li key={drill.id}>
            <Link
              to="/system-design/$taskId"
              params={{ taskId: drill.id }}
              className={styles.link}
              aria-label={`${drill.title} — ${drillMeta(drill)}`}
            >
              <LinkContent
                icon={drill.solved ? <Check size={ICON_SIZE} /> : <Code2 size={ICON_SIZE} />}
                color={drill.solved ? "emerald" : "blue"}
                title={drill.title}
                meta={drillMeta(drill)}
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
