import { useState, useCallback, useRef } from "react";
import {
  getCompletions,
  expandSnippet,
  addImportToFile,
  CompletionItem,
  TaskFile,
} from "@/shared/lib/code-editor";
import {
  getCaretCoordinates,
  calculatePopupPosition,
  PopupPositionResult,
} from "../lib/caret-coordinates";

export interface IntelliSenseState {
  isOpen: boolean;
  items: CompletionItem[];
  selectedIndex: number;
  word: string;
  popupPosition: PopupPositionResult;
  openCompletions: (
    code: string,
    cursorPos: number,
    textarea: HTMLTextAreaElement,
    force?: boolean
  ) => void;
  closeCompletions: () => void;
  handleCursorMove: (code: string, cursorPos: number, textarea?: HTMLTextAreaElement) => void;
  updatePosition: (textarea: HTMLTextAreaElement) => void;
  selectNext: () => void;
  selectPrev: () => void;
  selectIndex: (index: number) => void;
  applySelected: (
    code: string,
    cursorPos: number,
    files?: TaskFile[],
    filepath?: string,
    explicitItem?: CompletionItem
  ) => { newCode: string; newCursor: number } | null;
}

interface CompletionSession {
  lineIdx: number;
  startPos: number;
  cursorPos: number;
  word: string;
}

export function useIntelliSense(files: TaskFile[] = [], filepath = "main.jsx"): IntelliSenseState {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CompletionItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [word, setWord] = useState("");
  const [popupPosition, setPopupPosition] = useState<PopupPositionResult>({
    top: 0,
    left: 0,
    placement: "bottom",
    maxHeight: 220,
  });

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

      const caret = getCaretCoordinates(textarea, cursorPos);
      const position = calculatePopupPosition({
        caret,
        textarea,
        itemsCount: res.items.length,
      });

      setPopupPosition(position);

      sessionRef.current = {
        lineIdx: currentLineIdx,
        startPos: Math.max(0, cursorPos - res.word.length),
        cursorPos,
        word: res.word,
      };

      setItems(res.items);
      setWord(res.word);
      setSelectedIndex(0);
      setIsOpen(true);
    },
    [files, filepath, closeCompletions]
  );

  const updatePosition = useCallback(
    (textarea: HTMLTextAreaElement) => {
      if (!sessionRef.current) return;
      const caret = getCaretCoordinates(textarea, sessionRef.current.cursorPos);

      const clientHeight = textarea.clientHeight || 400;
      const viewportLineTop = caret.top - textarea.scrollTop;
      const viewportLineBottom = caret.lineBottom - textarea.scrollTop;

      if (viewportLineBottom < 0 || viewportLineTop > clientHeight) {
        closeCompletions();
        return;
      }

      const next = calculatePopupPosition({
        caret,
        textarea,
        itemsCount: items.length,
      });
      setPopupPosition(next);
    },
    [items.length, closeCompletions]
  );

  const handleCursorMove = useCallback(
    (code: string, cursorPos: number, textarea?: HTMLTextAreaElement) => {
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

      sessionRef.current.cursorPos = cursorPos;
      sessionRef.current.word = res.word;

      if (textarea) {
        const caret = getCaretCoordinates(textarea, cursorPos);
        const position = calculatePopupPosition({
          caret,
          textarea,
          itemsCount: res.items.length,
        });
        setPopupPosition(position);
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

  const selectIndex = useCallback((idx: number) => {
    setSelectedIndex(idx);
  }, []);

  const applySelected = useCallback(
    (
      code: string,
      cursorPos: number,
      _taskFiles: TaskFile[] = files,
      currentFilepath = filepath,
      explicitItem?: CompletionItem
    ) => {
      const selected = explicitItem ?? items[selectedIndex];
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
    updatePosition,
    selectNext,
    selectPrev,
    selectIndex,
    applySelected,
  };
}
