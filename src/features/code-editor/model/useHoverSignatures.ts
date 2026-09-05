import { useState, useCallback, useRef, useEffect } from "react";
import {
  getHoverInfo,
  getSignatureHelp,
  HoverInfo,
  SignatureHelpResult,
} from "@/shared/lib/code-editor";

export interface HoverSignaturesState {
  hoverInfo: HoverInfo | null;
  signatureHelp: SignatureHelpResult | null;
  position: { top: number; left: number };
  handleMouseMove: (e: React.MouseEvent<HTMLTextAreaElement>, code: string) => void;
  handleMouseLeave: () => void;
  updateSignatureHelp: (code: string, cursorPos: number) => void;
  closeHover: () => void;
}

export function useHoverSignatures(filepath = "main.jsx"): HoverSignaturesState {
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [signatureHelp, setSignatureHelp] = useState<SignatureHelpResult | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    };
  }, []);

  const closeHover = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoverInfo(null);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeHover();
  }, [closeHover]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLTextAreaElement>, code: string) => {
      const textarea = e.currentTarget;
      const rect = textarea.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      hoverTimeoutRef.current = setTimeout(() => {
        const lineHeight = 21;
        const charWidth = 8.4;
        const paddingTop = 16;
        const paddingLeft = 60;

        const lineIdx = Math.floor((clientY - paddingTop + textarea.scrollTop) / lineHeight);
        const colIdx = Math.floor((clientX - paddingLeft + textarea.scrollLeft) / charWidth);

        const lines = code.split("\n");
        if (lineIdx >= 0 && lineIdx < lines.length) {
          const line = lines[lineIdx];
          if (colIdx >= 0 && colIdx <= line.length) {
            let offset = 0;
            for (let i = 0; i < lineIdx; i++) {
              offset += lines[i].length + 1;
            }
            offset += colIdx;

            const info = getHoverInfo(code, offset, undefined, { filepath });
            if (info) {
              setHoverInfo(info);
              setPosition({
                top: Math.max(10, clientY - 80),
                left: Math.max(10, Math.min(clientX + 20, textarea.clientWidth - 320)),
              });
              return;
            }
          }
        }

        setHoverInfo(null);
      }, 300);
    },
    [filepath]
  );

  const updateSignatureHelp = useCallback(
    (code: string, cursorPos: number) => {
      const help = getSignatureHelp(code, cursorPos, { filepath });
      setSignatureHelp(help);
    },
    [filepath]
  );

  return {
    hoverInfo,
    signatureHelp,
    position,
    handleMouseMove,
    handleMouseLeave,
    updateSignatureHelp,
    closeHover,
  };
}
