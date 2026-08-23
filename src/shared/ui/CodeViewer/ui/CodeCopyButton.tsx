import React from "react";
import { clsx } from "clsx";
import { Copy, Check } from "lucide-react";
import { useCopyCode } from "../model/useCopyCode";
import { CodeCopyButtonProps } from "../types";
import styles from "../CodeViewer.module.css";

export const CodeCopyButton = ({ code, className }: CodeCopyButtonProps) => {
  const { copied, copy } = useCopyCode(code);

  const buttonClasses = clsx(styles.copyBtn, copied && styles.copied, className);

  return (
    <button
      type="button"
      className={buttonClasses}
      onClick={copy}
      title={copied ? "Скопировано в буфер обмена" : "Скопировать код"}
      aria-label="Скопировать код"
    >
      {copied ? <Check size={13} style={{ color: "currentColor" }} /> : <Copy size={13} />}
    </button>
  );
};
