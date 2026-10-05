import { useState, useCallback, useRef, useEffect } from "react";
import {
  getCompletions,
  expandSnippet,
  addImportToFile,
  CompletionItem,
  TaskFile,
  type TypeScriptCompletion,
  type TabStop,
} from "@/shared/lib/code-editor";
import {
  filterLocalCompletions,
  mergeCompletions,
  rankSemanticCompletions,
} from "../lib/semantic-completions";
import {
  getCaretCoordinates,
  calculatePopupPosition,
  PopupPositionResult,
  type PopupPlacement,
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
  applySelected: (
    code: string,
    cursorPos: number,
    files?: TaskFile[],
    filepath?: string,
    explicitItem?: CompletionItem
  ) => AppliedCompletion | null;
}

export interface AppliedCompletion {
  newCode: string;
  newCursor: number;
  /** Set when the inserted placeholder should stay selected. */
  newSelectionEnd?: number;
  /** Snippet fields to visit with Tab, in order. */
  tabStops?: TabStop[];
}

interface CompletionSession {
  code: string;
  lineIdx: number;
  startPos: number;
  cursorPos: number;
  word: string;
}

export function useIntelliSense(
  files: TaskFile[] = [],
  filepath = "main.jsx",
  requestSemanticCompletions?: (position: number, code: string) => Promise<TypeScriptCompletion[]>
): IntelliSenseState {
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
  // Side picked on first show and kept until close, so the list never jumps; height follows.
  const placementRef = useRef<PopupPlacement | undefined>(undefined);
  const completionRequest = useRef(0);
  const itemsRef = useRef<CompletionItem[]>([]);
  const selectedIndexRef = useRef(0);
  // Only a choice made with the arrows survives the list refresh; otherwise the
  // best match (first item) stays selected, as in VS Code.
  const userSelectedRef = useRef(false);

  const closeCompletions = useCallback(() => {
    completionRequest.current++;
    setIsOpen(false);
    setItems([]);
    setSelectedIndex(0);
    setWord("");
    itemsRef.current = [];
    selectedIndexRef.current = 0;
    userSelectedRef.current = false;
    sessionRef.current = null;
    placementRef.current = undefined;
  }, []);

  useEffect(() => {
    closeCompletions();
  }, [filepath, closeCompletions]);

  const openCompletions = useCallback(
    (code: string, cursorPos: number, textarea: HTMLTextAreaElement, force = false) => {
      const res = getCompletions(code, cursorPos, { files, filepath, force });
      const requestId = ++completionRequest.current;
      const query = res.word.toLowerCase();
      const isIdentifier =
        /^[a-z_$][\w$]*$/i.test(query) &&
        code.slice(cursorPos - res.word.length, cursorPos).toLowerCase() === query;
      const localItems =
        !force && isIdentifier ? filterLocalCompletions(res.items, res.word) : res.items;

      // Nothing typed yet: only a trigger character (`.`, a quote, `/`) asks for suggestions.
      const trigger = /[.'"/]$/.exec(code.slice(0, cursorPos))?.[0];
      if (!force && localItems.length === 0 && !query && !(trigger && requestSemanticCompletions)) {
        closeCompletions();
        return;
      }

      const currentLineIdx = code.substring(0, cursorPos).split("\n").length - 1;
      const startPos = Math.max(0, cursorPos - res.word.length);
      // Anchored to the start of the word, like VS Code: the list stays put while typing.
      const caret = getCaretCoordinates(textarea, startPos);

      const show = (nextItems: CompletionItem[], preserveSelection = false): void => {
        const position = calculatePopupPosition({
          caret,
          textarea,
          itemsCount: nextItems.length,
          lockedPlacement: placementRef.current,
        });
        if (nextItems.length > 0) placementRef.current = position.placement;
        setPopupPosition(position);
        if (!preserveSelection) userSelectedRef.current = false;
        const selectedLabel =
          userSelectedRef.current && itemsRef.current[selectedIndexRef.current]?.label;
        const nextIndex = Math.max(
          0,
          nextItems.findIndex((item) => item.label === selectedLabel)
        );
        itemsRef.current = nextItems;
        selectedIndexRef.current = nextIndex;
        sessionRef.current = {
          code,
          lineIdx: currentLineIdx,
          startPos,
          cursorPos,
          word: res.word,
        };
        setItems(nextItems);
        setWord(res.word);
        setSelectedIndex(nextIndex);
        setIsOpen(nextItems.length > 0);
      };
      show(localItems);

      if (requestSemanticCompletions) {
        void requestSemanticCompletions(cursorPos, code).then((semantic) => {
          if (requestId !== completionRequest.current || semantic.length === 0) return;
          const relevant = rankSemanticCompletions(semantic, {
            query: res.word,
            filterByQuery: !force && isIdentifier,
            trigger,
            onlyTriggered: !force && !query && localItems.length === 0,
          });
          if (relevant.length === 0) return;
          const localByLabel = new Map(localItems.map((item) => [item.label, item]));
          const semanticItems: CompletionItem[] = relevant.map((item) => {
            const autoImport = item.autoImport ?? localByLabel.get(item.label)?.autoImport;
            return {
              prefix: item.label,
              label: item.label,
              // Without a description the list's footer names the kind instead.
              detail: autoImport ? `Auto-import from '${autoImport.module}'` : "",
              kind: item.kind,
              insertText: item.insertText,
              replaceStart: item.replaceStart,
              replaceEnd: item.replaceEnd,
              // A local item with the same label must not lose its import action.
              autoImport,
              score: 200,
            };
          });
          show(mergeCompletions(semanticItems, localItems, res.word), true);
        });
      }
    },
    [files, filepath, requestSemanticCompletions, closeCompletions]
  );

  const updatePosition = useCallback(
    (textarea: HTMLTextAreaElement) => {
      if (!sessionRef.current) return;
      const caret = getCaretCoordinates(textarea, sessionRef.current.startPos);
      const clientHeight = textarea.clientHeight || 400;
      if (caret.lineBottom < textarea.scrollTop || caret.top - textarea.scrollTop > clientHeight) {
        closeCompletions();
        return;
      }
      setPopupPosition(
        calculatePopupPosition({
          caret,
          textarea,
          itemsCount: items.length,
          lockedPlacement: placementRef.current,
        })
      );
    },
    [items.length, closeCompletions]
  );

  const handleCursorMove = useCallback(
    (code: string, cursorPos: number, textarea?: HTMLTextAreaElement) => {
      if (!sessionRef.current) return;
      if (cursorPos === sessionRef.current.cursorPos && code === sessionRef.current.code) return;

      // Moving to another line or before the completed word closes the list.
      const currentLineIdx = code.substring(0, cursorPos).split("\n").length - 1;
      if (
        currentLineIdx !== sessionRef.current.lineIdx ||
        cursorPos < sessionRef.current.startPos
      ) {
        closeCompletions();
        return;
      }
      // Otherwise re-evaluate completions at the new position on the same line
      if (textarea) openCompletions(code, cursorPos, textarea);
    },
    [closeCompletions, openCompletions]
  );

  const selectNext = useCallback(() => {
    userSelectedRef.current = true;
    selectedIndexRef.current = (selectedIndexRef.current + 1) % (itemsRef.current.length || 1);
    setSelectedIndex(selectedIndexRef.current);
  }, []);

  const selectPrev = useCallback(() => {
    userSelectedRef.current = true;
    selectedIndexRef.current =
      (selectedIndexRef.current - 1 + (itemsRef.current.length || 1)) %
      (itemsRef.current.length || 1);
    setSelectedIndex(selectedIndexRef.current);
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
      let newSelectionEnd: number | undefined;
      let tabStops: TabStop[] = [];

      if (selected.snippet) {
        const expanded = expandSnippet(code, cursorPos, selected.snippet, word, {
          filepath: currentFilepath,
        });
        newCode = expanded.newCode;
        newCursor = expanded.newCursorPos;
        newSelectionEnd = expanded.newSelectionEnd;
        tabStops = expanded.tabStops;
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
          const shift = (offset: number): number =>
            offset >= importRes.insertIndex ? offset + importRes.insertedLength : offset;
          newCursor = shift(newCursor);
          newSelectionEnd = newSelectionEnd === undefined ? undefined : shift(newSelectionEnd);
          tabStops = tabStops.map(({ start, end }) => ({ start: shift(start), end: shift(end) }));
        }
      }

      closeCompletions();
      return { newCode, newCursor, newSelectionEnd, tabStops };
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
    applySelected,
  };
}
