import React from "react";
import { AlertCircle, Lightbulb, Wand2 } from "lucide-react";
import styles from "./QuickFixBanner.module.css";

export interface QuickFixBannerProps {
  diagnostic: { line: number; message: string; severity: "error" | "warning" | "hint" } | null;
  fixes: ReadonlyArray<{ description: string }>;
  onApply: (index: number) => void;
  /** Receives the first action so Cmd/Ctrl+. can move focus to it. */
  firstFixRef?: React.Ref<HTMLButtonElement>;
}

const MAX_FIXES = 3;

/** VS Code-style light bulb: TypeScript fixes for the problem at the caret. */
export const QuickFixBanner = ({
  diagnostic,
  fixes,
  onApply,
  firstFixRef,
}: QuickFixBannerProps): React.JSX.Element | null => {
  if (!diagnostic || fixes.length === 0) return null;
  const Icon = diagnostic.severity === "error" ? AlertCircle : Lightbulb;

  return (
    <div
      className={styles.quickfixBanner}
      data-severity={diagnostic.severity}
      role="toolbar"
      aria-label="Быстрые исправления"
    >
      <div className={styles.bannerLeft}>
        <Icon
          size={13}
          className={diagnostic.severity === "error" ? styles.iconError : styles.iconBulb}
        />
        <span className={styles.message} title={diagnostic.message}>
          Стр {diagnostic.line}: {diagnostic.message.replace(/^TS\d+: /, "")}
        </span>
      </div>
      <div className={styles.actions}>
        {fixes.slice(0, MAX_FIXES).map((fix, index) => (
          <button
            key={fix.description}
            ref={index === 0 ? firstFixRef : undefined}
            type="button"
            className={styles.fixBtn}
            onClick={() => onApply(index)}
            title={fix.description}
          >
            <Wand2 size={12} />
            <span>{fix.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
