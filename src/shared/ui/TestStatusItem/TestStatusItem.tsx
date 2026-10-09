import React, { useId } from "react";
import { Check, ChevronRight, Circle, LoaderCircle, MinusCircle, X } from "lucide-react";
import { clsx } from "clsx";
import styles from "./TestStatusItem.module.css";

export type TestStatus = "idle" | "running" | "passed" | "failed" | "skipped";

export interface TestStatusItemProps {
  status: TestStatus;
  title: React.ReactNode;
  /** Replaces the status icon, e.g. for the compiler case. */
  icon?: React.ReactNode;
  /** The result belongs to older code: drawn dimmed. */
  isStale?: boolean;
  /** Details below the title. Without them the row is not expandable. */
  children?: React.ReactNode;
  isExpanded?: boolean;
  onToggle?: () => void;
  className?: string;
}

const STATUS_LABELS: Record<TestStatus, string> = {
  idle: "не запускался",
  running: "проверяется",
  passed: "пройден",
  failed: "не пройден",
  skipped: "не проверен",
};

const STATUS_ICONS: Record<TestStatus, React.ReactNode> = {
  idle: <Circle size={14} />,
  running: <LoaderCircle size={14} className={styles.spinner} />,
  passed: <Check size={14} />,
  failed: <X size={14} />,
  skipped: <MinusCircle size={14} />,
};

/** One row of a test list: status icon, title and optional expandable details. Presentational. */
export const TestStatusItem = ({
  status,
  title,
  icon,
  isStale = false,
  children,
  isExpanded = false,
  onToggle,
  className,
}: TestStatusItemProps): React.JSX.Element => {
  const detailsId = useId();
  const hasDetails = children !== undefined && children !== null && children !== false;
  const heading = (
    <>
      <span className={clsx(styles.icon, styles[`status_${status}`])} aria-hidden="true">
        {icon ?? STATUS_ICONS[status]}
      </span>
      <span className={styles.title}>{title}</span>
      <span className={styles.srOnly}>: {STATUS_LABELS[status]}</span>
      {hasDetails && (
        <ChevronRight
          size={14}
          className={clsx(styles.chevron, isExpanded && styles.chevronOpen)}
          aria-hidden="true"
        />
      )}
    </>
  );

  return (
    <li className={clsx(styles.item, isStale && styles.stale, className)}>
      {hasDetails ? (
        <button
          type="button"
          className={styles.header}
          aria-expanded={isExpanded}
          aria-controls={detailsId}
          onClick={onToggle}
        >
          {heading}
        </button>
      ) : (
        <div className={styles.header}>{heading}</div>
      )}
      {hasDetails && isExpanded && (
        <div id={detailsId} className={styles.details}>
          {children}
        </div>
      )}
    </li>
  );
};

TestStatusItem.displayName = "TestStatusItem";
