import React from "react";
import { TopicIconBox, type TopicIconBoxColor } from "@/shared/ui";
import styles from "./SectionHero.module.css";

export interface SectionHeroProps {
  icon: React.ReactNode;
  color: TopicIconBoxColor;
  title: string;
  description: string;
  /** A button next to the title, e.g. «Решать задачи». */
  action?: React.ReactNode;
}

/** The top of a page of the section, as on the group pages of the other sections: icon, title, description. */
export const SectionHero = ({
  icon,
  color,
  title,
  description,
  action,
}: SectionHeroProps): React.JSX.Element => (
  <header className={styles.hero}>
    <TopicIconBox colorVariant={color} size="lg">
      {icon}
    </TopicIconBox>
    <div className={styles.content}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{title}</h1>
        {action}
      </div>
      <p className={styles.description}>{description}</p>
    </div>
  </header>
);
