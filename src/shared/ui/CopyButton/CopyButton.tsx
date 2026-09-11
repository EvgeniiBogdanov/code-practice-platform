import React, { memo } from "react";
import { clsx } from "clsx";
import { Copy, Check } from "lucide-react";
import { useCopy } from "../../lib/hooks";
import styles from "./CopyButton.module.css";

import type { CopyButtonProps } from "./model/copy-button";
import { CodeButton } from "../CodeButton";

export const CopyButton = memo(
  ({
    textToCopy,
    label = "Копировать",
    copiedLabel = "Скопировано",
    className,
    iconOnly = false,
  }: CopyButtonProps): React.JSX.Element => {
    const { copied, copy } = useCopy(textToCopy);

    if (iconOnly)
      return (
        <CodeButton
          icon={copied ? <Check size={14} /> : <Copy size={14} />}
          variant={copied ? "success" : "default"}
          className={className}
          aria-label={label}
          title={copied ? copiedLabel : label}
          onClick={() => {
            void copy();
          }}
        />
      );

    return (
      <button
        type="button"
        onClick={() => copy()}
        className={clsx(styles.copyButton, copied && styles.copied, className)}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        <span>{copied ? copiedLabel : label}</span>
      </button>
    );
  }
);

CopyButton.displayName = "CopyButton";
