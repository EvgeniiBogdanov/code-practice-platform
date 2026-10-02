import type { ReactNode, RefObject } from "react";

export interface ExpandablePanelProps {
  readonly children: ReactNode;
  readonly expanded: boolean;
  readonly onCollapse: () => void;
  readonly label: string;
  readonly className?: string;
  readonly panelRef?: RefObject<HTMLDialogElement | null>;
}
