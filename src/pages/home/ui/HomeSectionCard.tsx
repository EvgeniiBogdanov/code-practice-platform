import React, { memo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import { Card } from "@/shared/ui";
import styles from "./HomePage.module.css";

export interface HomeSectionCardProps {
  coverClass: string;
  coverIcon: React.ReactNode;
  title: string;
  tagText: string;
  tagClass: string;
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
    tagClass,
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
            <span className={clsx(styles.cardTag, tagClass)}>{tagText}</span>
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
              {solved} из {total} решено ({pct}%)
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
