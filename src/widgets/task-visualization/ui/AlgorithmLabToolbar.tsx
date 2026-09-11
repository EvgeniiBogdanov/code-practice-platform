import type { JSX } from "react";
import { Box } from "lucide-react";
import { PanelToolbar } from "@/shared/ui";
import type { AlgorithmLabToolbarProps } from "../model/visualization-toolbar";
import { VisualizationToolbarActions } from "./VisualizationToolbarActions";
import styles from "./AlgorithmLabToolbar.module.css";

export const AlgorithmLabToolbar = ({
  title = "Визуализатор",
  className,
  ...actions
}: AlgorithmLabToolbarProps): JSX.Element => (
  <PanelToolbar
    className={className}
    left={
      <div className={styles.tab}>
        <Box size={13} className={styles.icon} aria-hidden="true" />
        <span className={styles.title}>{title}</span>
      </div>
    }
    right={<VisualizationToolbarActions {...actions} />}
  />
);
