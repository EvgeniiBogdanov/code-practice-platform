import React from "react";
import { clsx } from "clsx";
import { Copy, Check } from "lucide-react";
import { Tooltip } from "../../Tooltip";
import { useCopyCode } from "../model/use-copy-code";
import { CodeCopyButtonProps } from "../types";
import styles from "../CodeViewer.module.css";

export const CodeCopyButton = ({ code, className }: CodeCopyButtonProps): React.JSX.Element => {
  const { copied, copy } = useCopyCode(code);
  const tooltipText = copied ? "Скопировано в буфер обмена" : "Скопировать код";

  const buttonClasses = clsx(styles.copyBtn, copied && styles.copied, className);

  return (
    <Tooltip content={tooltipText} side="left">
      <button
        type="button"
        className={buttonClasses}
        onClick={copy}
        aria-label="Скопировать код"
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
    </Tooltip>
  );
};
