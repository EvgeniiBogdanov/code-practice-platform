import React, { memo } from "react";
import { clsx } from "clsx";
import { UiSkeleton } from "@/shared/ui";
import styles from "./TaskTabSkeleton.module.css";

export interface CodeEditorSkeletonProps {
  className?: string;
  showConsole?: boolean;
}

const CODE_LINES: Array<{ indent: number; width: string | number }> = [
  { indent: 0, width: 230 },
  { indent: 16, width: 190 },
  { indent: 16, width: 280 },
  { indent: 32, width: 240 },
  { indent: 32, width: 160 },
  { indent: 48, width: 210 },
  { indent: 32, width: 24 },
  { indent: 32, width: 150 },
  { indent: 16, width: 24 },
  { indent: 16, width: 110 },
  { indent: 0, width: 20 },
  { indent: 0, width: 0 }, // empty line
  { indent: 0, width: 290 },
  { indent: 0, width: 250 },
  { indent: 16, width: 180 },
  { indent: 0, width: 20 },
];

export const CodeEditorSkeleton = memo(
  ({ className, showConsole = true }: CodeEditorSkeletonProps): React.JSX.Element => {
    return (
      <div className={clsx(styles.editorWrapper, className)} aria-hidden="true">
        {/* Top Editor Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <div className={styles.fileTab}>
              <UiSkeleton width={12} height={12} radius={2} />
              <UiSkeleton width={62} height={12} radius={3} />
            </div>
          </div>

          <div className={styles.toolbarRight}>
            <UiSkeleton width={26} height={26} radius={6} />
            <UiSkeleton width={26} height={26} radius={6} />
            <UiSkeleton width={26} height={26} radius={6} />
            <UiSkeleton width={26} height={26} radius={6} />
            <UiSkeleton width={26} height={26} radius={6} />
            <UiSkeleton width={26} height={26} radius={6} />
            <UiSkeleton width={26} height={26} radius={6} />
            <UiSkeleton width={20} height={14} radius={3} />
            <UiSkeleton width={26} height={26} radius={6} />
            <UiSkeleton width={26} height={26} radius={6} />
          </div>
        </div>

        {/* Editor Body */}
        <div className={styles.editorBody}>
          {/* Gutter with 16 line numbers */}
          <div className={styles.gutter}>
            {CODE_LINES.map((_, i) => (
              <div key={i} className={styles.gutterNumber}>
                <UiSkeleton width={i >= 9 ? 16 : 10} height={12} radius={2} />
              </div>
            ))}
          </div>

          {/* Code text lines */}
          <div className={styles.codeLines}>
            {CODE_LINES.map((line, i) => (
              <div key={i} className={styles.codeLine} style={{ paddingLeft: line.indent }}>
                {line.width !== 0 && (
                  <UiSkeleton width={line.width} height={13} radius={3} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Collapsed Console Header matching closed JsConsole */}
        {showConsole && (
          <div className={styles.bottomConsoleWrapper}>
            <div className={styles.consoleHeader}>
              <div className={styles.consoleHeaderLeft}>
                <UiSkeleton width={13} height={13} radius={2} />
                <UiSkeleton width={55} height={12} radius={3} />
              </div>

              <div className={styles.consoleHeaderRight}>
                <UiSkeleton width={26} height={26} radius={6} />
                <UiSkeleton width={26} height={26} radius={6} />
                <UiSkeleton width={26} height={26} radius={6} />
                <UiSkeleton width={26} height={26} radius={6} />
                <UiSkeleton width={26} height={26} radius={6} />
                <UiSkeleton width={26} height={26} radius={6} />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Status Bar */}
        <div className={styles.statusBar}>
          <div className={styles.statusLeft}>
            <UiSkeleton width={70} height={11} radius={3} />
            <span className={styles.statusSep}>|</span>
            <UiSkeleton width={120} height={11} radius={3} />
            <span className={styles.statusSep}>|</span>
            <UiSkeleton width={60} height={11} radius={3} />
            <span className={styles.statusSep}>|</span>
            <UiSkeleton width={50} height={11} radius={3} />
          </div>

          <div className={styles.statusRight}>
            <UiSkeleton width={55} height={11} radius={3} />
            <span className={styles.statusSep}>|</span>
            <UiSkeleton width={35} height={11} radius={3} />
            <span className={styles.statusSep}>|</span>
            <UiSkeleton width={65} height={11} radius={3} />
          </div>
        </div>
      </div>
    );
  }
);

CodeEditorSkeleton.displayName = "CodeEditorSkeleton";
