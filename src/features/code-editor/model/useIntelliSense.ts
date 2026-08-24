import { useState, useCallback, useRef } from "react";
import {
  getCompletions,
  expandSnippet,
  addImportToFile,
  CompletionItem,
  TaskFile,
} from "@/shared/lib/code-editor";

export interface IntelliSenseState {
  isOpen: boolean;
  items: CompletionItem[];
  selectedIndex: number;
  word: string;
  popupPosition: { top: number; left: number };
  openCompletions: (
    code: string,
    cursorPos: number,
    textarea: HTMLTextAreaElement,
    force?: boolean
  ) => void;
  closeCompletions: () => void;
  handleCursorMove: (code: string, cursorPos: number, textarea: HTMLTextAreaElement) => void;
  selectNext: () => void;
  selectPrev: () => void;
  applySelected: (
    code: string,
    cursorPos: number,
    files?: TaskFile[],
    filepath?: string
  ) => { newCode: string; newCursor: number } | null;
}

interface CompletionSession {
  lineIdx: number;
  startPos: number;
  word: string;
}

export function useIntelliSense(files: TaskFile[] = [], filepath = "main.jsx"): IntelliSenseState {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CompletionItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [word, setWord] = useState("");
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const sessionRef = useRef<CompletionSession | null>(null);

  const closeCompletions = useCallback(() => {
    setIsOpen(false);
    setItems([]);
    setSelectedIndex(0);
    setWord("");
    sessionRef.current = null;
  }, []);

  const openCompletions = useCallback(
    (code: string, cursorPos: number, textarea: HTMLTextAreaElement, force = false) => {
      const res = getCompletions(code, cursorPos, { files, filepath, force });
      if (res.items.length === 0) {
        closeCompletions();
        return;
      }

      const lines = code.substring(0, cursorPos).split("\n");
      const currentLineIdx = lines.length - 1;
      const currentColIdx = lines[currentLineIdx].length;

      // Compute dynamic metrics based on current font and styling
      const computed = window.getComputedStyle(textarea);
      const parsedFontSize = parseFloat(computed.fontSize) || 14;
      const lineHeight = parseFloat(computed.lineHeight) || parsedFontSize * 1.5;
      const charWidth = parsedFontSize * 0.6;
      const paddingTop = parseFloat(computed.paddingTop) || 16;
      const paddingLeft = parseFloat(computed.paddingLeft) || 60;

      const top = paddingTop + (currentLineIdx + 1) * lineHeight - textarea.scrollTop;
      const left = paddingLeft + currentColIdx * charWidth - textarea.scrollLeft;

      setPopupPosition({
        top: Math.max(10, top),
        left: Math.max(10, Math.min(left, textarea.clientWidth - 280)),
      });

      sessionRef.current = {
        lineIdx: currentLineIdx,
        startPos: Math.max(0, cursorPos - res.word.length),
        word: res.word,
      };

      setItems(res.items);
      setWord(res.word);
      setSelectedIndex(0);
      setIsOpen(true);
    },
    [files, filepath, closeCompletions]
  );

  const handleCursorMove = useCallback(
    (code: string, cursorPos: number, _textarea?: HTMLTextAreaElement) => {
      if (!sessionRef.current) return;

      const lines = code.substring(0, cursorPos).split("\n");
      const currentLineIdx = lines.length - 1;

      // 1. If cursor moved to a different line, close immediately
      if (currentLineIdx !== sessionRef.current.lineIdx) {
        closeCompletions();
        return;
      }

      // 2. If cursor moved before the start of the completion word, close
      if (cursorPos < sessionRef.current.startPos) {
        closeCompletions();
        return;
      }

      // 3. Re-evaluate completions at new position on same line
      const res = getCompletions(code, cursorPos, { files, filepath, force: false });
      if (res.items.length === 0) {
        closeCompletions();
        return;
      }

      setItems(res.items);
      setWord(res.word);
    },
    [files, filepath, closeCompletions]
  );

  const selectNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % (items.length || 1));
  }, [items.length]);

  const selectPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + (items.length || 1)) % (items.length || 1));
  }, [items.length]);

  const applySelected = useCallback(
    (
      code: string,
      cursorPos: number,
      _taskFiles: TaskFile[] = files,
      currentFilepath = filepath
    ) => {
      const selected = items[selectedIndex];
      if (!selected) return null;

      let newCode = code;
      let newCursor = cursorPos;

      if (selected.snippet) {
        const expanded = expandSnippet(code, cursorPos, selected.snippet, word, {
          filepath: currentFilepath,
        });
        newCode = expanded.newCode;
        newCursor = expanded.newCursorPos;
      } else {
        const replaceStart =
          selected.replaceStart !== undefined ? selected.replaceStart : cursorPos - word.length;
        const replaceEnd = selected.replaceEnd !== undefined ? selected.replaceEnd : cursorPos;

        const before = code.substring(0, replaceStart);
        const after = code.substring(replaceEnd);
        newCode = before + selected.insertText + after;
        newCursor =
          selected.cursorOffset !== undefined
            ? replaceStart + selected.cursorOffset
            : replaceStart + selected.insertText.length;
      }

      if (selected.autoImport) {
        const importRes = addImportToFile(
          newCode,
          selected.autoImport.symbol,
          selected.autoImport.module,
          selected.autoImport.isDefault
        );
        if (importRes.insertedLength > 0) {
          newCode = importRes.newCode;
          if (newCursor >= importRes.insertIndex) {
            newCursor += importRes.insertedLength;
          }
        }
      }

      closeCompletions();
      return { newCode, newCursor };
    },
    [items, selectedIndex, word, files, filepath, closeCompletions]
  );

  return {
    isOpen,
    items,
    selectedIndex,
    word,
    popupPosition,
    openCompletions,
    closeCompletions,
    handleCursorMove,
    selectNext,
    selectPrev,
    applySelected,
  };
}
