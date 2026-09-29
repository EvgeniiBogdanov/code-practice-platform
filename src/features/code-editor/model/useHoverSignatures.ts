import { useState, useCallback, useRef, useEffect } from "react";
import {
  getHoverInfo,
  getSignatureHelp,
  HoverInfo,
  SignatureHelpResult,
  type TypeScriptHover,
  type TypeScriptSignature,
} from "@/shared/lib/code-editor";
import { getCaretCoordinates } from "../lib/caret-coordinates";

export interface HoverSignaturesState {
  hoverInfo: HoverInfo | null;
  signatureHelp: SignatureHelpResult | null;
  signaturePosition: { top: number; left: number };
  position: { top: number; left: number };
  handleMouseMove: (e: React.MouseEvent<HTMLTextAreaElement>, code: string) => void;
  handleMouseLeave: () => void;
  updateSignatureHelp: (code: string, cursorPos: number, textarea?: HTMLTextAreaElement) => void;
  closeHover: () => void;
  closeSignature: () => void;
}

export function useHoverSignatures(
  filepath = "main.jsx",
  requestHover?: (position: number, code: string) => Promise<TypeScriptHover | null>,
  requestSignature?: (position: number, code: string) => Promise<TypeScriptSignature | null>
): HoverSignaturesState {
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [signatureHelp, setSignatureHelp] = useState<SignatureHelpResult | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [signaturePosition, setSignaturePosition] = useState({ top: 0, left: 0 });
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const signatureTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverRequestId = useRef(0);
  const signatureRequestId = useRef(0);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      if (signatureTimeoutRef.current) clearTimeout(signatureTimeoutRef.current);
    };
  }, []);

  const closeHover = useCallback(() => {
    hoverRequestId.current++;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoverInfo(null);
  }, []);

  const closeSignature = useCallback(() => {
    signatureRequestId.current++;
    if (signatureTimeoutRef.current) clearTimeout(signatureTimeoutRef.current);
    setSignatureHelp(null);
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

      const requestId = ++hoverRequestId.current;
      hoverTimeoutRef.current = setTimeout(async () => {
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

            const semantic = await requestHover?.(offset, code);
            if (requestId !== hoverRequestId.current) return;
            const info: HoverInfo | null = semantic
              ? { symbol: "", signature: semantic.signature, documentation: semantic.documentation }
              : getHoverInfo(code, offset, undefined, { filepath });
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
    [filepath, requestHover]
  );

  const updateSignatureHelp = useCallback(
    (code: string, cursorPos: number, textarea?: HTMLTextAreaElement) => {
      if (signatureTimeoutRef.current) clearTimeout(signatureTimeoutRef.current);
      const requestId = ++signatureRequestId.current;
      if (textarea) {
        const caret = getCaretCoordinates(textarea, cursorPos);
        setSignaturePosition({
          top: caret.lineBottom - textarea.scrollTop + 4,
          left: Math.max(0, caret.left - textarea.scrollLeft),
        });
      }
      signatureTimeoutRef.current = setTimeout(async () => {
        const semantic = await requestSignature?.(cursorPos, code);
        if (requestId !== signatureRequestId.current) return;
        const fallback = getSignatureHelp(code, cursorPos, { filepath });
        setSignatureHelp(
          semantic
            ? {
                functionName: "",
                signature: semantic.signature,
                description: semantic.documentation,
                module: "typescript",
                parameters: [],
                activeParameter: semantic.activeParameter,
              }
            : fallback
        );
      }, 120);
    },
    [filepath, requestSignature]
  );

  return {
    hoverInfo,
    signatureHelp,
    signaturePosition,
    position,
    handleMouseMove,
    handleMouseLeave,
    updateSignatureHelp,
    closeHover,
    closeSignature,
  };
}
