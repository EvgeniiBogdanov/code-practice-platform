import React from "react";
import { clsx } from "clsx";
import { MarkdownView } from "@/shared/ui";
import type { TypeScriptSignature } from "@/shared/lib/code-editor";
import {
  useContentWidgetLayout,
  type ContentWidgetAnchor,
} from "../../model/useContentWidgetLayout";
import { CodeText } from "../CodeText";
import styles from "./SignatureHelpCard.module.css";

export interface SignatureHelpCardProps {
  signature: TypeScriptSignature;
  position: ContentWidgetAnchor;
}

/** Parameter hints next to the caret line with the current argument emphasised. */
export const SignatureHelpCard = ({
  signature,
  position,
}: SignatureHelpCardProps): React.JSX.Element => {
  const { ref, placement, left } = useContentWidgetLayout<HTMLDivElement>(position, signature);
  const active = signature.parameters[signature.activeParameter];
  const text = signature.signature;
  return (
    <div
      ref={ref}
      className={clsx(styles.card, placement === "bottom" && styles.below)}
      role="tooltip"
      data-placement={placement}
      style={
        {
          "--signature-top": `${position.top}px`,
          "--signature-bottom": `${position.bottom}px`,
          "--signature-left": `${left}px`,
        } as React.CSSProperties
      }
    >
      <code className={styles.signature}>
        {active ? (
          <>
            <CodeText code={text.slice(0, active.start)} />
            <strong className={styles.activeParameter}>
              <CodeText code={text.slice(active.start, active.end)} />
            </strong>
            <CodeText code={text.slice(active.end)} />
          </>
        ) : (
          <CodeText code={text} />
        )}
      </code>
      {signature.documentation && (
        <MarkdownView compact content={signature.documentation} className={styles.documentation} />
      )}
    </div>
  );
};
