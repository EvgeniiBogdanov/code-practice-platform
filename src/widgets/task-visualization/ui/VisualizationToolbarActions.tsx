import type { JSX } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { CodeButton, Tooltip, ZoomControls } from "@/shared/ui";
import type { AlgorithmLabToolbarProps } from "../model/visualization-toolbar";
import styles from "./AlgorithmLabToolbar.module.css";

export const VisualizationToolbarActions = ({
  isFullscreen = false,
  onToggleFullscreen,
  zoom = 1,
  onIncreaseZoom,
  onDecreaseZoom,
  onResetZoom,
}: AlgorithmLabToolbarProps): JSX.Element => (
  <div className={styles.toolbarActions}>
    {(onIncreaseZoom || onDecreaseZoom || onResetZoom) && (
      <ZoomControls
        value={zoom}
        min={0.5}
        max={2.5}
        defaultValue={1}
        displayValue={`${Math.round(zoom * 100)}%`}
        valueLabel={`Масштаб ${Math.round(zoom * 100)}%`}
        increaseLabel="Увеличить масштаб"
        decreaseLabel="Уменьшить масштаб"
        resetLabel="Сбросить масштаб"
        onIncrease={onIncreaseZoom}
        onDecrease={onDecreaseZoom}
        onReset={onResetZoom}
      />
    )}
    <Tooltip
      content={isFullscreen ? "Свернуть (Esc)" : "Развернуть на весь экран"}
      side="bottom"
      disabled={isFullscreen}
    >
      <CodeButton
        icon={isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        onClick={onToggleFullscreen}
        disabled={!onToggleFullscreen}
        aria-expanded={isFullscreen}
        title={isFullscreen ? "Свернуть (Esc)" : undefined}
        aria-label={isFullscreen ? "Свернуть" : "Развернуть на весь экран"}
      />
    </Tooltip>
  </div>
);
