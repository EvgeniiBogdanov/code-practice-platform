import type { JSX } from "react";
import { FileCode } from "lucide-react";
import { CopyButton } from "../../CopyButton";
import { PanelToolbar } from "../../PanelToolbar";
import { ZoomControls } from "../../ZoomControls";
import type { CodeStepViewerProps } from "../model/code-step-viewer";
import styles from "./CodeStepViewer.module.css";

export const CodeStepToolbar = ({
  code,
  filename = "solution.js",
  fontSize = 14,
  minFontSize = 12,
  maxFontSize = 24,
  defaultFontSize = 14,
  onIncreaseFontSize,
  onDecreaseFontSize,
  onResetFontSize,
}: CodeStepViewerProps): JSX.Element => {
  return (
    <PanelToolbar
      left={
        <div className={styles.tab}>
          <FileCode size={13} className={styles.fileIconJs} aria-hidden="true" />
          <span className={styles.tabName}>{filename}</span>
        </div>
      }
      right={
        <div className={styles.toolbarActions}>
          <CopyButton textToCopy={code} label="Скопировать код" iconOnly />
          <ZoomControls
            value={fontSize}
            min={minFontSize}
            max={maxFontSize}
            defaultValue={defaultFontSize}
            displayValue={`${fontSize}px`}
            valueLabel={`Размер шрифта ${fontSize}px`}
            decreaseLabel="Уменьшить шрифт"
            increaseLabel="Увеличить шрифт"
            resetLabel="Сбросить шрифт"
            onIncrease={onIncreaseFontSize}
            onDecrease={onDecreaseFontSize}
            onReset={onResetFontSize}
          />
        </div>
      }
    />
  );
};
