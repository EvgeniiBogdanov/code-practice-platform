import React from "react";
import { SegmentedProgress, type ProgressSegmentTone } from "@/shared/ui";
import { SKILL_STATE_META, formatSkillPercent } from "../../lib/skillStateMeta";
import type { SkillState } from "../../types";

const SEGMENTS = 5;

export interface SkillMasteryBarProps {
  mastery: number;
  state: SkillState;
  /** Skill name for the accessible label. */
  title: string;
  className?: string;
}

/** Five coarse segments: precise enough to compare skills, without false precision. */
export const SkillMasteryBar = ({
  mastery,
  state,
  title,
  className,
}: SkillMasteryBarProps): React.JSX.Element => {
  const percent = formatSkillPercent(mastery);
  const filled = percent > 0 ? Math.max(1, Math.round((percent / 100) * SEGMENTS)) : 0;
  const tone: ProgressSegmentTone = SKILL_STATE_META[state].tone;
  const segments = Array.from({ length: SEGMENTS }, (_, index): ProgressSegmentTone =>
    index < filled ? tone : "neutral"
  );

  return (
    <SegmentedProgress
      segments={segments}
      label={`Освоение навыка «${title}»`}
      value={{ now: percent, max: 100 }}
      className={className}
    />
  );
};
