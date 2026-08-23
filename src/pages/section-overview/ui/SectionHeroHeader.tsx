import React from "react";
import { TopicIconBox, TopicIconBoxColor, Badge } from "@/shared/ui";
import { SectionType } from "@/entities/task";
import styles from "./SectionOverviewPage.module.css";

export interface SectionHeroHeaderProps {
  section?: SectionType;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ReactNode;
}

const getSectionColorVariant = (section?: SectionType): TopicIconBoxColor => {
  if (section === "javascript") return "amber";
  if (section === "react") return "blue";
  if (section === "algorithms") return "purple";
  return "default";
};

export const SectionHeroHeader = ({
  section,
  title,
  subtitle,
  badge,
  icon,
}: SectionHeroHeaderProps) => {
  const colorVariant = getSectionColorVariant(section);

  return (
    <div className={styles.pageHeader}>
      <div className={styles.titleRow}>
        <TopicIconBox colorVariant={colorVariant} size="md">
          {icon}
        </TopicIconBox>
        <h1 className={styles.mainTitle}>{title}</h1>
        <Badge variant="gray" size="md" uppercase={false}>
          {badge}
        </Badge>
      </div>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
};
