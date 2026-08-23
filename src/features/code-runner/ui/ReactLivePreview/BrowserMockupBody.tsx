import React, { memo } from "react";
import { AlertCircle } from "lucide-react";
import styles from "./ReactLivePreview.module.css";

export interface BrowserMockupBodyProps {
  compileError: Error | { message?: string } | null;
  srcDoc: string | null;
  iframeKey: string;
  iframeHeight: number;
  title: string;
  hasFiles: boolean;
  onIframeLoad?: (e: React.SyntheticEvent<HTMLIFrameElement>) => void;
}

export const BrowserMockupBody = memo(
  ({
    compileError,
    srcDoc,
    iframeKey,
    iframeHeight,
    title,
    hasFiles,
    onIframeLoad,
  }: BrowserMockupBodyProps) => {
    if (compileError) {
      return (
        <div className={styles.body}>
          <div className={styles.errorWrapper}>
            <div className={styles.errorCard}>
              <div className={styles.errorTitle}>
                <AlertCircle size={16} />
                <span>Ошибка синтаксиса в коде задачи</span>
              </div>
              <div className={styles.errorMessage}>
                {compileError.message || String(compileError)}
              </div>
              <p className={styles.errorHint}>
                Переключитесь на вкладку «Код», чтобы исправить синтаксическую ошибку.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (srcDoc) {
      return (
        <div className={styles.body}>
          <iframe
            key={iframeKey}
            srcDoc={srcDoc}
            onLoad={onIframeLoad}
            title={title}
            scrolling="no"
            className={styles.iframe}
            style={{ height: `${iframeHeight}px` }}
          />
        </div>
      );
    }

    return (
      <div className={styles.body}>
        <div className={styles.emptyState}>
          {hasFiles
            ? "Загрузка песочницы..."
            : "Напишите код React-компонента во вкладке «Код», чтобы увидеть его интерфейс."}
        </div>
      </div>
    );
  }
);

BrowserMockupBody.displayName = "BrowserMockupBody";
