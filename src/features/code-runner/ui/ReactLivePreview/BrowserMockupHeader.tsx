import { memo } from "react";
import { Lock, RotateCcw, Sparkles, Code2 } from "lucide-react";
import { clsx } from "clsx";
import { ViewModeToggle } from "@/shared/ui";
import styles from "./ReactLivePreview.module.css";

export interface BrowserMockupHeaderProps {
  fileName: string;
  onReload: (e: React.MouseEvent<HTMLButtonElement>) => void;
  previewTarget?: "candidate" | "solution";
  onPreviewTargetChange?: (target: "candidate" | "solution") => void;
  hasSolutionReference?: boolean;
}

export const BrowserMockupHeader = memo(
  ({
    fileName,
    onReload,
    previewTarget,
    onPreviewTargetChange,
    hasSolutionReference = false,
  }: BrowserMockupHeaderProps) => {
    return (
      <div className={styles.header}>
        <div className={styles.left}>
          <div className={styles.dots}>
            <span className={clsx(styles.dot, styles.dotClose)} />
            <span className={clsx(styles.dot, styles.dotMin)} />
            <span className={clsx(styles.dot, styles.dotMax)} />
          </div>
        </div>

        <div className={styles.addressBar}>
          <div className={styles.addressContent}>
            <Lock size={11} className={styles.lockIcon} />
            <span className={styles.host}>preview</span>
            <span className={styles.path}>/ {fileName}</span>
          </div>

          <button
            type="button"
            onClick={onReload}
            className={styles.reloadBtn}
            aria-label="Перезагрузить песочницу"
          >
            <RotateCcw size={11} />
          </button>
        </div>

        <div className={styles.right}>
          {hasSolutionReference && previewTarget && onPreviewTargetChange && (
            <ViewModeToggle
              mode={previewTarget}
              onChange={onPreviewTargetChange}
              options={[
                {
                  value: "candidate",
                  label: "Решение",
                  icon: <Code2 size={12} />,
                  title: "Просмотр вашего решения (живой код)",
                },
                {
                  value: "solution",
                  label: "Эталон",
                  icon: <Sparkles size={12} />,
                  title: "Просмотр эталонного интерфейса (референс)",
                },
              ]}
              className={styles.headerToggle}
            />
          )}
        </div>
      </div>
    );
  }
);

BrowserMockupHeader.displayName = "BrowserMockupHeader";
