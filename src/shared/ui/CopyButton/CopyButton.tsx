import React, { useState } from "react";
import { clsx } from "clsx";
import { Copy, Check } from "lucide-react";
import styles from "./CopyButton.module.css";

export interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}

export function CopyButton({
  textToCopy,
  label = "Копировать",
  copiedLabel = "Скопировано",
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={clsx(styles.copyButton, copied && styles.copied, className)}
      title={label}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      <span>{copied ? copiedLabel : label}</span>
    </button>
  );
}
