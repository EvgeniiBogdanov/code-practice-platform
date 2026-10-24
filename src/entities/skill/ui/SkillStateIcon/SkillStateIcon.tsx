import React from "react";
import { clsx } from "clsx";
import {
  CircleCheck,
  CircleDashed,
  Crown,
  Hourglass,
  Sprout,
  TrendingUp,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import type { SkillState } from "../../types";
import { getSkillToneClass } from "../skillTone";
import styles from "./SkillStateIcon.module.css";

const ICONS: Readonly<Record<SkillState, LucideIcon>> = {
  weak: TriangleAlert,
  fading: Hourglass,
  new: CircleDashed,
  intro: Sprout,
  practice: TrendingUp,
  confident: CircleCheck,
  master: Crown,
};

export interface SkillStateIconProps {
  state: SkillState;
  size?: number;
  className?: string;
}

/** Decorative: the state is always also named in text next to it. */
export const SkillStateIcon = ({
  state,
  size = 14,
  className,
}: SkillStateIconProps): React.JSX.Element => {
  const Icon = ICONS[state];
  return (
    <Icon
      size={size}
      aria-hidden="true"
      className={clsx(styles.icon, getSkillToneClass(state), className)}
    />
  );
};
