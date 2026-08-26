import React, { memo } from "react";
import { clsx } from "clsx";
import { Copy, Check } from "lucide-react";
import { useCopy } from "../../lib/hooks";
import styles from "./CopyButton.module.css";

export interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}

export const CopyButton = memo(
  ({
    textToCopy,
    label = "Копировать",
    copiedLabel = "Скопировано",
    className,
  }: CopyButtonProps): React.JSX.Element => {
    const { copied, copy } = useCopy(textToCopy);

    return (
      <button
        type="button"
        onClick={() => copy()}
        className={clsx(styles.copyButton, copied && styles.copied, className)}
        title={label}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        <span>{copied ? copiedLabel : label}</span>
      </button>
    );
  }
);

CopyButton.displayName = "CopyButton";
