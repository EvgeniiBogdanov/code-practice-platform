import { useState, useCallback } from "react";

export const useCopyCode = (code: string) => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    if (!code) return;

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [code]);

  return { copied, copy };
};
