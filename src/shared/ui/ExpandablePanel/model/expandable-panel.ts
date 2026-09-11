import type { ReactNode } from "react";

export interface ExpandablePanelProps {
  readonly children: ReactNode;
  readonly expanded: boolean;
  readonly onCollapse: () => void;
  readonly label: string;
  readonly className?: string;
}
