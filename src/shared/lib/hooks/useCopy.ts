import { useState, useCallback, useRef, useEffect } from "react";

export interface UseCopyReturn {
  copied: boolean;
  copy: (text?: string) => Promise<boolean>;
}

export const useCopy = (defaultText?: string, timeout = 2000): UseCopyReturn => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copy = useCallback(
    async (textToCopy?: string): Promise<boolean> => {
      const targetText = textToCopy !== undefined ? textToCopy : defaultText || "";
      if (!targetText) return false;

      try {
        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(targetText);
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = targetText;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), timeout);
        return true;
      } catch {
        return false;
      }
    },
    [defaultText, timeout]
  );

  return { copied, copy };
};
