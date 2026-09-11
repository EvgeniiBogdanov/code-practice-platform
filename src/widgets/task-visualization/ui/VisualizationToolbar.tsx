import type { JSX } from "react";
import { useUIStore } from "@/entities/ui-state";
import type { AlgorithmLabToolbarProps } from "../model/visualization-toolbar";
import { AlgorithmLabToolbar } from "./AlgorithmLabToolbar";

export const VisualizationToolbar = (props: AlgorithmLabToolbarProps): JSX.Element => {
  const zoom = useUIStore((state) => state.visualizerZoom);
  const increase = useUIStore((state) => state.increaseVisualizerZoom);
  const decrease = useUIStore((state) => state.decreaseVisualizerZoom);
  const reset = useUIStore((state) => state.resetVisualizerZoom);
  return (
    <AlgorithmLabToolbar
      {...props}
      zoom={zoom}
      onIncreaseZoom={increase}
      onDecreaseZoom={decrease}
      onResetZoom={reset}
    />
  );
};
