import React, { forwardRef, memo } from "react";
import { clsx } from "clsx";
import { Tooltip } from "@/shared/ui";
import styles from "./LineNumbers.module.css";

export interface LineNumbersProps {
  lineCount: number;
  activeLine?: number;
  errorLines?: Set<number>;
  warningLines?: Set<number>;
  /** Diagnostic messages per line, shown on hover like the VS Code gutter. */
  lineMessages?: ReadonlyMap<number, string[]>;
  /** Measured row heights while word wrap is on: numbers follow wrapped lines. */
  lineHeights?: ReadonlyArray<number> | null;
  fontSize?: number;
  className?: string;
}

interface LineNumberRowProps {
  num: number;
  isActive: boolean;
  isErr: boolean;
  isWarn: boolean;
  /** Measured height of the wrapped row; undefined while the gutter has fixed rows. */
  height?: number;
  wrapped: boolean;
  messages?: string[];
}

// One row per line: a caret move re-renders the two rows whose active state changed, not
// the whole gutter (thousands of nodes in a long file).
const LineNumberRow = memo(
  ({
    num,
    isActive,
    isErr,
    isWarn,
    height,
    wrapped,
    messages,
  }: LineNumberRowProps): React.JSX.Element => {
    const lineNode = (
      <div
        className={clsx(
          styles.lineNumber,
          wrapped && styles.wrapped,
          isActive && styles.activeLine,
          isErr && styles.hasError,
          isWarn && styles.hasWarning
        )}
        style={height ? ({ "--row-height": `${height}px` } as React.CSSProperties) : undefined}
      >
        {isErr && <span className={styles.errorDot}>•</span>}
        {num}
      </div>
    );

    if (!messages?.length) return lineNode;
    return (
      <Tooltip
        content={messages.join("\n")}
        contentClassName={styles.messages}
        side="right"
        sideOffset={4}
      >
        {lineNode}
      </Tooltip>
    );
  }
);
LineNumberRow.displayName = "LineNumberRow";

export const LineNumbers = forwardRef<HTMLDivElement, LineNumbersProps>(
  (
    {
      lineCount,
      activeLine = 1,
      errorLines,
      warningLines,
      lineMessages,
      lineHeights,
      fontSize = 13,
      className,
    }: LineNumbersProps,
    ref
  ): React.JSX.Element => {
    const count = Math.max(1, lineCount);

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
        {Array.from({ length: count }, (_, index) => {
          const num = index + 1;
          return (
            <LineNumberRow
              key={num}
              num={num}
              isActive={activeLine === num}
              isErr={Boolean(errorLines?.has(num))}
              isWarn={Boolean(warningLines?.has(num))}
              height={lineHeights?.[index]}
              wrapped={Boolean(lineHeights)}
              messages={lineMessages?.get(num)}
            />
          );
        })}
      </div>
    );
  }
);

LineNumbers.displayName = "LineNumbers";
