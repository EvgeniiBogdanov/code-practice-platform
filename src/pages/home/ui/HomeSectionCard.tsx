import React, { memo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import { Card, UiNumberScramble, Badge, type BadgeVariant, type BadgeSize } from "@/shared/ui";
import styles from "./HomePage.module.css";

export interface HomeSectionCardProps {
  coverClass: string;
  coverIcon: React.ReactNode;
  title: string;
  tagText: string;
  tagVariant?: BadgeVariant;
  tagClass?: string;
  tagSize?: BadgeSize;
  description: string;
  tags: string[];
  solved: number;
  total: number;
  pct: number;
  to: string;
  actionBtnClass: string;
}

export const HomeSectionCard = memo(
  ({
    coverClass,
    coverIcon,
    title,
    tagText,
    tagVariant = "gray",
    tagClass,
    tagSize = "sm",
    description,
    tags,
    solved,
    total,
    pct,
    to,
    actionBtnClass,
  }: HomeSectionCardProps) => {
    return (
      <Card className={styles.galleryCard}>
        <div className={clsx(styles.cardCover, coverClass)}>{coverIcon}</div>
        <div className={styles.cardBody}>
          <div className={styles.cardHeaderRow}>
            <h3 className={styles.cardTitle}>{title}</h3>
            <Badge variant={tagVariant} size={tagSize} uppercase={false} className={tagClass}>
              {tagText}
            </Badge>
          </div>
          <p className={styles.cardDesc}>{description}</p>
          <div className={styles.cardTags}>
            {tags.map((tag) => (
              <span key={tag} className={styles.subtag}>
                {tag}
              </span>
            ))}
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.cardProgress}>
              <UiNumberScramble value={solved} /> из {total} решено (
              <UiNumberScramble value={pct} suffix="%" />)
            </span>
            <Link to={to} className={clsx(styles.actionBtn, actionBtnClass)}>
              <span>Открыть</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </Card>
    );
  }
);

HomeSectionCard.displayName = "HomeSectionCard";
