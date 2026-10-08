import type { JSX } from "react";
import { Lightbulb, Pin, TriangleAlert } from "lucide-react";

export interface RecommendationIconProps {
  isRecommended?: boolean;
  hasWarning?: boolean;
}

export const RecommendationIcon = ({
  isRecommended,
  hasWarning,
}: RecommendationIconProps): JSX.Element => {
  if (isRecommended) return <Lightbulb size={13} />;
  return hasWarning ? <TriangleAlert size={13} /> : <Pin size={13} />;
};
