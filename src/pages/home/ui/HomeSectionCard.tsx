import React, { memo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import { Badge, UiNumberScramble, type BadgeVariant } from "@/shared/ui";
import styles from "./HomeSectionCard.module.css";

export type HomeSectionCardTone = "javascript" | "typescript" | "react" | "algorithms";

export interface HomeSectionCardProps {
  tone: HomeSectionCardTone;
  icon: React.ReactNode;
  title: string;
  tagText: string;
  tagVariant: BadgeVariant;
  description: string;
  topics: readonly string[];
  solved: number;
  total: number;
  pct: number;
  to: string;
}

export const HomeSectionCard = memo(
  ({
    tone,
    icon,
    title,
    tagText,
    tagVariant,
    description,
    topics,
    solved,
    total,
    pct,
    to,
  }: HomeSectionCardProps): React.JSX.Element => (
    <article className={clsx(styles.card, styles[`card_${tone}`])}>
      <header className={styles.header}>
        <span className={styles.iconBox}>{icon}</span>
        <h3 className={styles.title}>{title}</h3>
        <Badge variant={tagVariant} size="sm" uppercase={false}>
          {tagText}
        </Badge>
      </header>
      <p className={styles.description}>{description}</p>
      <ul className={styles.topics}>
        {topics.map((topic) => (
          <li key={topic} className={styles.topic}>
            {topic}
          </li>
        ))}
      </ul>
      <div className={styles.footer}>
        <span className={styles.progress}>
          <UiNumberScramble value={solved} /> из {total} решено (
          <UiNumberScramble value={pct} suffix="%" />)
        </span>
        <Link to={to} className={styles.open}>
          Открыть
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
);

HomeSectionCard.displayName = "HomeSectionCard";
