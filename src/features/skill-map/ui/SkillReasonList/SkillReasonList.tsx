import React from "react";
import { clsx } from "clsx";
import {
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleX,
  Clock,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import {
  getToneClass,
  type SkillReason,
  type SkillReasonKind,
  type SkillTone,
} from "@/entities/skill";
import styles from "./SkillReasonList.module.css";

const REASON_META: Readonly<Record<SkillReasonKind, { icon: LucideIcon; tone: SkillTone }>> = {
  unsolved: { icon: CircleX, tone: "danger" },
  hard: { icon: CircleAlert, tone: "warning" },
  overdue: { icon: Clock, tone: "warning" },
  new: { icon: CircleDashed, tone: "neutral" },
  solid: { icon: CircleCheck, tone: "success" },
  prerequisite: { icon: Waypoints, tone: "accent" },
};

export interface SkillReasonListProps {
  reasons: readonly SkillReason[];
  className?: string;
}

export const SkillReasonList = ({
  reasons,
  className,
}: SkillReasonListProps): React.JSX.Element => (
  <ul className={clsx(styles.list, className)}>
    {reasons.map((reason) => {
      const { icon: Icon, tone } = REASON_META[reason.kind];
      return (
        <li key={reason.text} className={clsx(styles.reason, getToneClass(tone))}>
          <Icon size={14} aria-hidden="true" className={styles.icon} />
          {reason.text}
        </li>
      );
    })}
  </ul>
);
