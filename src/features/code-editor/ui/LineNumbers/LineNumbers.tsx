import React, { forwardRef } from "react";
import { clsx } from "clsx";
import { Tooltip } from "@/shared/ui";
import styles from "./LineNumbers.module.css";

export interface LineNumbersProps {
  lineCount: number;
  activeLine?: number;
  errorLines?: Set<number>;
  warningLines?: Set<number>;
  fontSize?: number;
  className?: string;
}

export const LineNumbers = forwardRef<HTMLDivElement, LineNumbersProps>(
  (
    {
      lineCount,
      activeLine = 1,
      errorLines,
      warningLines,
      fontSize = 13,
      className,
    }: LineNumbersProps,
    ref
  ): React.JSX.Element => {
    const count = Math.max(1, lineCount);
    const lines = Array.from({ length: count }, (_, i) => i + 1);

    // Dynamic gutter width for files with > 99 lines
    const digits = String(count).length;
    const dynamicGutterWidth = Math.max(36, 20 + digits * 9);

    return (
      <div
        ref={ref}
        className={clsx(styles.gutter, className)}
        aria-hidden="true"
        style={
          {
            "--editor-font-size": `${fontSize}px`,
            width: `${dynamicGutterWidth}px`,
            minWidth: `${dynamicGutterWidth}px`,
          } as React.CSSProperties
        }
      >
        {lines.map((num) => {
          const isErr = errorLines?.has(num);
          const isWarn = warningLines?.has(num);
          const isActive = activeLine === num;

          const lineNode = (
            <div
              key={num}
              className={clsx(
                styles.lineNumber,
                isActive && styles.activeLine,
                isErr && styles.hasError,
                isWarn && styles.hasWarning
              )}
            >
              {isErr && <span className={styles.errorDot}>•</span>}
              {num}
            </div>
          );

          if (isErr) {
            return (
              <Tooltip
                key={num}
                content="Ошибка синтаксиса или опечатка на строке"
                side="right"
                sideOffset={4}
              >
                {lineNode}
              </Tooltip>
            );
          }

          return lineNode;
        })}
      </div>
    );
  }
);

LineNumbers.displayName = "LineNumbers";
