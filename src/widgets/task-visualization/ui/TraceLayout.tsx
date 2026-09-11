import { clsx } from "clsx";
import type { JSX } from "react";
import { Card, ResizableSplitPane } from "@/shared/ui";
import { useUIStore } from "@/entities/ui-state";
import type { TraceLayoutProps } from "../model/trace-layout";
import styles from "./AlgorithmLab.module.css";

export const TraceLayout = ({ fullscreen, visual, code }: TraceLayoutProps): JSX.Element => {
  const ratio = useUIStore((state) => state.visualizerSplitRatio);
  const setRatio = useUIStore((state) => state.setVisualizerSplitRatio);
  const resetRatio = useUIStore((state) => state.resetVisualizerSplitRatio);
  return (
    <ResizableSplitPane
      layout={fullscreen ? "split" : "stack"}
      splitRatio={ratio}
      onSplitRatioChange={setRatio}
      onReset={resetRatio}
      className={styles.splitContainer}
      ariaLabel="Разделитель визуализации и кода"
      left={
        <Card className={clsx(styles.visualizerCard, fullscreen && styles.visualPane)}>
          {visual}
        </Card>
      }
      right={code}
    />
  );
};
