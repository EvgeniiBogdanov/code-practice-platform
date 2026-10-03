import React from "react";
import { clsx } from "clsx";
import { UiReveal } from "@/shared/ui";
import scene from "../scene.module.css";
import styles from "./SectionHeading.module.css";

export interface SectionHeadingProps {
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "center" | "start";
  /** Id for `aria-labelledby` of the parent section. */
  titleId?: string;
  className?: string;
}

export const SectionHeading = ({
  title,
  lead,
  align = "center",
  titleId,
  className,
}: SectionHeadingProps): React.JSX.Element => (
  <div className={clsx(styles.heading, styles[align], scene.depthSlow, className)}>
    <UiReveal order={1}>
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
    </UiReveal>
    {lead && (
      <UiReveal order={2}>
        <p className={styles.lead}>{lead}</p>
      </UiReveal>
    )}
  </div>
);
