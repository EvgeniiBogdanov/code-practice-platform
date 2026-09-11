import type { JSX } from "react";
import { CodeStepViewer, type CodeStepViewerProps } from "@/shared/ui/CodeViewer";
import { MIN_CODE_FONT_SIZE, MAX_CODE_FONT_SIZE, useUIStore } from "@/entities/ui-state";

export const TraceCodeViewer = (props: CodeStepViewerProps): JSX.Element => {
  const fontSize = useUIStore((state) => state.visualizerCodeFontSize);
  const increase = useUIStore((state) => state.increaseVisualizerCodeFontSize);
  const decrease = useUIStore((state) => state.decreaseVisualizerCodeFontSize);
  const reset = useUIStore((state) => state.resetVisualizerCodeFontSize);
  return (
    <CodeStepViewer
      ariaLabel="Код решения алгоритма с текущим шагом"
      minFontSize={MIN_CODE_FONT_SIZE}
      maxFontSize={MAX_CODE_FONT_SIZE}
      fontSize={fontSize}
      onIncreaseFontSize={increase}
      onDecreaseFontSize={decrease}
      onResetFontSize={reset}
      {...props}
    />
  );
};
