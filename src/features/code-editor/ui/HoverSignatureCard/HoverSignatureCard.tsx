import React from "react";
import { clsx } from "clsx";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { MarkdownView } from "@/shared/ui";
import type { TypeScriptHover } from "@/shared/lib/code-editor";
import {
  useContentWidgetLayout,
  type ContentWidgetAnchor,
} from "../../model/use-content-widget-layout";
import { CodeText } from "../CodeText";
import styles from "./HoverSignatureCard.module.css";

export interface HoverSignatureCardProps {
  info: TypeScriptHover | null;
  problems?: ReadonlyArray<{ id: string; message: string; severity: string }>;
  position: ContentWidgetAnchor;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}

/** Documentation links leave the editor in a new tab, as VS Code opens them in the browser. */
const openLinkExternally = (e: React.MouseEvent<HTMLDivElement>): void => {
  if (!(e.target instanceof Element)) return;
  const href = e.target.closest("a")?.getAttribute("href");
  if (!href || !/^https?:/.test(href)) return;
  e.preventDefault();
  window.open(href, "_blank", "noopener,noreferrer");
};

export const HoverSignatureCard = ({
  info,
  problems = [],
  position,
  onMouseEnter,
  onMouseLeave,
  className,
}: HoverSignatureCardProps): React.JSX.Element => {
  const { ref, placement, left } = useContentWidgetLayout<HTMLDivElement>(
    position,
    info ?? problems
  );

  return (
    <div
      ref={ref}
      className={clsx(styles.card, placement === "bottom" && styles.below, className)}
      role="tooltip"
      data-placement={placement}
      style={
        {
          "--popup-top": `${position.top}px`,
          "--popup-bottom": `${position.bottom}px`,
          "--popup-left": `${left}px`,
        } as React.CSSProperties
      }
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={openLinkExternally}
    >
      {problems.map((problem) => {
        const Icon = problem.severity === "warning" ? AlertTriangle : AlertCircle;
        return (
          <div
            key={problem.id}
            className={clsx(styles.problem, problem.severity === "warning" && styles.warning)}
          >
            <Icon size={14} className={styles.problemIcon} aria-hidden="true" />
            <span>{problem.message}</span>
          </div>
        );
      })}
      {info && (
        <pre className={styles.signature}>
          <CodeText code={info.signature} />
        </pre>
      )}
      {info?.documentation && (
        <MarkdownView compact content={info.documentation} className={styles.description} />
      )}
    </div>
  );
};
