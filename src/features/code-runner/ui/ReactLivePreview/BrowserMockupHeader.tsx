import { memo } from "react";
import { Lock, RotateCcw } from "lucide-react";
import { clsx } from "clsx";
import styles from "./ReactLivePreview.module.css";

export interface BrowserMockupHeaderProps {
  fileName: string;
  onReload: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const BrowserMockupHeader = memo(({ fileName, onReload }: BrowserMockupHeaderProps) => {
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

      <div className={styles.right} />
    </div>
  );
});

BrowserMockupHeader.displayName = "BrowserMockupHeader";
