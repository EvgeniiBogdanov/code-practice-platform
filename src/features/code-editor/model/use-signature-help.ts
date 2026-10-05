import { useCallback, useEffect, useRef, useState } from "react";
import type { TypeScriptSignature } from "@/shared/lib/code-editor";
import { getCaretCoordinates } from "../lib/caret-coordinates";
import type { ContentWidgetAnchor } from "./use-content-widget-layout";

interface SignatureHelpOptions {
  code: string;
  cursorOffset: number;
  enabled: boolean;
  /** Open on typing `(` and `,` (setting «Подсказка параметров при наборе»). */
  triggerOnType: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  requestSignature: (position: number, code: string) => Promise<TypeScriptSignature | null>;
}

export interface SignatureHelpState {
  signature: TypeScriptSignature | null;
  /** Caret line edges inside the textarea viewport; the card sits above or below. */
  position: ContentWidgetAnchor;
  /** Ctrl/Cmd+Shift+Space: open the hints on demand. */
  trigger: () => void;
  /** Keeps the card attached to the caret line while the editor scrolls. */
  updatePosition: () => void;
  close: () => void;
}

// VS Code opens parameter hints on `(` and `,` when they are allowed on typing.
const TRIGGER = /[(,]\s*$/;
const NO_POSITION: ContentWidgetAnchor = { top: 0, bottom: 0, left: 0 };

const getAnchor = (textarea: HTMLTextAreaElement, offset: number): ContentWidgetAnchor => {
  const caret = getCaretCoordinates(textarea, offset);
  return {
    top: caret.top - textarea.scrollTop,
    bottom: caret.lineBottom - textarea.scrollTop,
    left: Math.max(0, caret.left - textarea.scrollLeft),
  };
};

export const useSignatureHelp = ({
  code,
  cursorOffset,
  enabled,
  triggerOnType,
  textareaRef,
  requestSignature,
}: SignatureHelpOptions): SignatureHelpState => {
  const [state, setState] = useState<{
    signature: TypeScriptSignature;
    position: ContentWidgetAnchor;
  } | null>(null);
  const [triggerCount, setTriggerCount] = useState(0);
  // Once opened (on demand or by a typed trigger) the hints follow the caret until it leaves
  // the call (the service answers null). Set before the first answer: fast typing (`(x`)
  // moves the caret past `(` before it arrives, which must not lose the session.
  const activeRef = useRef(false);
  const offsetRef = useRef(cursorOffset);

  const close = useCallback((): void => {
    activeRef.current = false;
    setState(null);
  }, []);

  useEffect(() => {
    if (!enabled) {
      close();
      return;
    }
    const typedTrigger =
      triggerOnType && TRIGGER.test(code.slice(Math.max(0, cursorOffset - 32), cursorOffset));
    if (!typedTrigger && !activeRef.current) return;
    activeRef.current = true;
    let cancelled = false;
    void requestSignature(cursorOffset, code).then((signature) => {
      const textarea = textareaRef.current;
      if (cancelled) return;
      if (!signature || !textarea) {
        close();
        return;
      }
      offsetRef.current = cursorOffset;
      setState({ signature, position: getAnchor(textarea, cursorOffset) });
    });
    return (): void => {
      cancelled = true;
    };
  }, [
    code,
    cursorOffset,
    enabled,
    triggerOnType,
    triggerCount,
    requestSignature,
    textareaRef,
    close,
  ]);

  const trigger = useCallback((): void => {
    activeRef.current = true;
    setTriggerCount((count) => count + 1);
  }, []);

  const updatePosition = useCallback((): void => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    setState((current) => {
      if (!current) return current;
      const position = getAnchor(textarea, offsetRef.current);
      // VS Code hides the hints once their line scrolls out of view.
      if (position.bottom < 0 || position.top > textarea.clientHeight) {
        activeRef.current = false;
        return null;
      }
      return { ...current, position };
    });
  }, [textareaRef]);

  return {
    signature: state?.signature ?? null,
    position: state?.position ?? NO_POSITION,
    trigger,
    updatePosition,
    close,
  };
};
