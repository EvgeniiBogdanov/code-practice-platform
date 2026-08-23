import { useState, useCallback, useEffect, useRef } from "react";
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
  selectNext: () => void;
  selectPrev: () => void;
  applySelected: (
    code: string,
    cursorPos: number,
    files?: TaskFile[],
    filepath?: string
  ) => { newCode: string; newCursor: number } | null;
}

export function useIntelliSense(files: TaskFile[] = [], filepath = "main.jsx"): IntelliSenseState {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CompletionItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [word, setWord] = useState("");
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const closeCompletions = useCallback(() => {
    setIsOpen(false);
    setItems([]);
    setSelectedIndex(0);
    setWord("");
  }, []);

  const openCompletions = useCallback(
    (code: string, cursorPos: number, textarea: HTMLTextAreaElement, force = false) => {
      const res = getCompletions(code, cursorPos, { files, filepath, force });
      if (res.items.length === 0) {
        closeCompletions();
        return;
      }

      // Calculate approximate pixel coordinates
      const lines = code.substring(0, cursorPos).split("\n");
      const currentLineIdx = lines.length - 1;
      const currentColIdx = lines[currentLineIdx].length;

      const lineHeight = 21;
      const charWidth = 8.4;
      const paddingTop = 16;
      const paddingLeft = 60; // line numbers width + padding

      const top = paddingTop + (currentLineIdx + 1) * lineHeight - textarea.scrollTop;
      const left = paddingLeft + currentColIdx * charWidth - textarea.scrollLeft;

      setPopupPosition({
        top: Math.max(10, top),
        left: Math.max(10, Math.min(left, textarea.clientWidth - 280)),
      });

      setItems(res.items);
      setWord(res.word);
      setSelectedIndex(0);
      setIsOpen(true);
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
      taskFiles: TaskFile[] = files,
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
    selectNext,
    selectPrev,
    applySelected,
  };
}
