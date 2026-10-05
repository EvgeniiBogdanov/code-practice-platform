import React, { useState, useMemo, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import {
  highlightCode,
  getAutoCloseTagEdit,
  getLinkedTagEdit,
  getLanguageId,
  formatCode,
  findMatchingBracketPair,
} from "@/shared/lib/code-editor";
import { useUIStore } from "@/entities/ui-state";
import { useCodeHistory, type HistoryEntry } from "./useCodeHistory";
import { useIntelliSense, type AppliedCompletion } from "./useIntelliSense";
import { useHoverSignatures } from "./useHoverSignatures";
import { useEditorKeyHandlers } from "./useEditorKeyHandlers";
import { useMultiCursor } from "./useMultiCursor";
import { useFindReplace } from "./use-find-replace";
import { ApplyEdit, CodeEditorProps, CursorPosition } from "./types";
import { TAB_SIZE, getLanguageInfo } from "../lib/editor-utils";
import { matchesKey } from "../lib/editor-key-helpers";
import { applyTextChanges } from "../lib/text-changes";
import { useTypeScriptDiagnostics } from "./use-typescript-diagnostics";
import { useEditorDiagnostics } from "./use-editor-diagnostics";
import { useSignatureHelp } from "./use-signature-help";
import { useSnippetSession } from "./use-snippet-session";
import { useDefinitionNavigation } from "./use-definition-navigation";
import { useWrappedLineHeights } from "./use-wrapped-line-heights";
import { getCaretCoordinates } from "../lib/caret-coordinates";

const MODIFIER_KEYS = new Set(["Shift", "Control", "Alt", "Meta"]);

interface PendingSelection {
  start: number;
  end: number;
  direction: "forward" | "backward" | "none";
}

export const useCodeEditor = ({
  code,
  onChange,
  onRun,
  files = [],
  filepath = "main.jsx",
  historyScope,
  readOnly = false,
  isFullscreen,
  onToggleFullscreen,
  onFileSelect,
}: CodeEditorProps) => {
  const fontSize = useUIStore((state) => state.editorFontSize);
  const increaseFontSize = useUIStore((state) => state.increaseEditorFontSize);
  const decreaseFontSize = useUIStore((state) => state.decreaseEditorFontSize);
  const wordWrap = useUIStore((state) => state.editorWordWrap);
  const setWordWrap = useUIStore((state) => state.setEditorWordWrap);
  const toggleWordWrap = useUIStore((state) => state.toggleEditorWordWrap);
  const hideTooltips = useUIStore((state) => state.hideTooltips);
  const parameterHintsOnType = useUIStore((state) => state.editorParameterHintsOnType);
  const isLinterEnabled = useUIStore((state) => state.editorLinterEnabled);
  const setEditorLinterEnabled = useUIStore((state) => state.setEditorLinterEnabled);
  const toggleEditorLinterEnabled = useUIStore((state) => state.toggleEditorLinterEnabled);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const pendingSelectionRef = useRef<PendingSelection | null>(null);
  const firstQuickFixRef = useRef<HTMLButtonElement>(null);

  const [internalFullscreen, setInternalFullscreen] = useState(false);
  const effectiveFullscreen = isFullscreen !== undefined ? isFullscreen : internalFullscreen;
  const toggleFullscreen = useCallback(() => {
    if (onToggleFullscreen) {
      onToggleFullscreen();
    } else {
      setInternalFullscreen((prev) => !prev);
    }
  }, [onToggleFullscreen]);
  const [cursorPos, setCursorPos] = useState<CursorPosition>({ line: 1, col: 1, offset: 0 });
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleToggleLinter = useCallback(
    (checked?: boolean) => {
      if (typeof checked === "boolean") {
        setEditorLinterEnabled(checked);
      } else {
        toggleEditorLinterEnabled();
      }
    },
    [setEditorLinterEnabled, toggleEditorLinterEnabled]
  );

  const history = useCodeHistory(code, historyScope);
  const languageId = getLanguageId(filepath);
  const supportsLanguageService =
    ["javascript", "javascriptreact", "typescript", "typescriptreact"].includes(languageId) &&
    typeof Worker !== "undefined";
  const typeScriptAnalysis = useTypeScriptDiagnostics(
    { code, filepath, files },
    isLinterEnabled && supportsLanguageService,
    supportsLanguageService
  );
  const diagnostics = useEditorDiagnostics({
    problems: isLinterEnabled ? typeScriptAnalysis.problems : null,
    isPending: typeScriptAnalysis.isPending,
    cursorOffset: cursorPos.offset,
    cursorLine: cursorPos.line,
    filepath,
    readOnly,
    requestCodeFixes: typeScriptAnalysis.requestCodeFixes,
  });
  const intelliSense = useIntelliSense(files, filepath, typeScriptAnalysis.requestCompletions);
  const hoverSignatures = useHoverSignatures(
    typeScriptAnalysis.requestHover,
    highlightRef,
    diagnostics.getProblemsAt
  );
  const multiCursor = useMultiCursor(filepath);
  const snippetSession = useSnippetSession();
  const signatureHelp = useSignatureHelp({
    code,
    cursorOffset: cursorPos.offset,
    enabled: supportsLanguageService && !readOnly,
    triggerOnType: parameterHintsOnType,
    textareaRef,
    requestSignature: typeScriptAnalysis.requestSignature,
  });

  const updateCursorCoords = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const offset = textarea.selectionStart;
    const text = textarea.value;
    let line = 1;
    let lineStart = 0;
    for (let newline = text.indexOf("\n"); newline !== -1 && newline < offset;) {
      line++;
      lineStart = newline + 1;
      newline = text.indexOf("\n", lineStart);
    }
    const col = offset - lineStart + 1;
    // One keystroke reports the caret from several events; an unchanged one renders nothing.
    setCursorPos((current) =>
      current.offset === offset && current.line === line && current.col === col
        ? current
        : { line, col, offset }
    );
  }, []);

  const markSaving = useCallback((): void => {
    setSaveStatus("saving");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => setSaveStatus("saved"), 450);
  }, []);

  const flushSelection = useCallback((): void => {
    const selection = pendingSelectionRef.current;
    const textarea = textareaRef.current;
    if (!selection || !textarea) return;
    pendingSelectionRef.current = null;
    textarea.focus();
    textarea.setSelectionRange(selection.start, selection.end, selection.direction);
    updateCursorCoords();
  }, [updateCursorCoords]);

  /**
   * Selects a range once React has committed the next value. Setting the
   * selection earlier is lost because a controlled value moves the caret.
   */
  const selectAfterRender = useCallback((start: number, end = start): void => {
    pendingSelectionRef.current = {
      start,
      end,
      direction: textareaRef.current?.selectionDirection ?? "none",
    };
  }, []);

  // Runs after every commit: the pending selection belongs to the value just rendered.
  useLayoutEffect(flushSelection);

  const applyEdit = useCallback<ApplyEdit>(
    (nextCode, selectionStart, selectionEnd = selectionStart) => {
      selectAfterRender(selectionStart, selectionEnd);
      if (nextCode === code) {
        flushSelection();
        return;
      }
      onChange(nextCode);
      history.pushHistory(nextCode, selectionStart);
      markSaving();
    },
    [code, onChange, history, markSaving, selectAfterRender, flushSelection]
  );

  const find = useFindReplace({
    code,
    readOnly,
    textareaRef,
    applyEdit,
    onSelect: updateCursorCoords,
  });

  const restoreEntry = useCallback(
    (entry: HistoryEntry | null): void => {
      if (!entry || readOnly) return;
      multiCursor.clearSelections();
      selectAfterRender(entry.cursor);
      if (entry.code === code) flushSelection();
      else onChange(entry.code);
    },
    [code, onChange, readOnly, multiCursor, selectAfterRender, flushSelection]
  );

  // React's onBeforeInput is a keypress polyfill: only the native event reports
  // `historyUndo`/`historyRedo` (Edit menu, touch gestures), which must use our stack.
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const handleBeforeInput = (event: Event): void => {
      if (!(event instanceof InputEvent)) return;
      if (event.inputType === "historyUndo" || event.inputType === "historyRedo") {
        event.preventDefault();
        restoreEntry(event.inputType === "historyUndo" ? history.undo(code) : history.redo(code));
        return;
      }
      history.captureCursor(textarea.selectionStart);
    };
    textarea.addEventListener("beforeinput", handleBeforeInput);
    return () => textarea.removeEventListener("beforeinput", handleBeforeInput);
  }, [code, history, restoreEntry]);

  const applyCompletion = useCallback(
    (applied: AppliedCompletion): void => {
      applyEdit(applied.newCode, applied.newCursor, applied.newSelectionEnd);
      snippetSession.start(applied.tabStops ?? [], applied.newCode);
    },
    [applyEdit, snippetSession]
  );

  const jumpToTabStop = useCallback(
    (direction: 1 | -1): boolean => {
      const textarea = textareaRef.current;
      if (!textarea) return false;
      const stop = snippetSession.jump(direction, code, textarea.selectionStart);
      if (!stop) return false;
      textarea.setSelectionRange(stop.start, stop.end);
      updateCursorCoords();
      return true;
    },
    [code, snippetSession, updateCursorCoords]
  );

  // The notice describes the text it was produced for and disappears with the next edit.
  const [formatFailure, setFormatFailure] = useState<{ code: string; message: string } | null>(
    null
  );
  const handleFormat = useCallback(async () => {
    if (!code || readOnly) return;
    const cursor = textareaRef.current?.selectionStart ?? 0;
    const formatted = await formatCode(code, filepath, cursor);
    if (formatted.status !== "formatted") {
      setFormatFailure({
        code,
        message:
          formatted.status === "unsupported"
            ? "Форматирование недоступно для этого типа файла"
            : "Не удалось отформатировать: в коде синтаксическая ошибка",
      });
      return;
    }
    setFormatFailure(null);
    if (formatted.code !== code) applyEdit(formatted.code, formatted.cursorOffset);
  }, [code, filepath, readOnly, applyEdit]);
  const formatNotice = formatFailure?.code === code ? formatFailure.message : null;

  const { handleKeyDown } = useEditorKeyHandlers({
    code,
    applyEdit,
    restoreEntry,
    applyCompletion,
    jumpToTabStop,
    intelliSense,
    history,
    multiCursor,
    onRun,
    tabSize: TAB_SIZE,
    wordWrap,
    readOnly,
    filepath,
  });

  /** Selects a range and scrolls it to the upper third of the editor. */
  const revealRange = useCallback(
    (start: number, end: number): void => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.focus();
      textarea.setSelectionRange(start, end);
      const caret = getCaretCoordinates(textarea, start);
      if (
        caret.top < textarea.scrollTop ||
        caret.lineBottom > textarea.scrollTop + textarea.clientHeight
      ) {
        textarea.scrollTop = Math.max(0, caret.top - textarea.clientHeight / 3);
      }
      updateCursorCoords();
    },
    [updateCursorCoords]
  );

  const goToDefinition = useDefinitionNavigation({
    filepath,
    files,
    onFileSelect,
    requestDefinition: typeScriptAnalysis.requestDefinition,
    reveal: revealRange,
  });

  /** F8 / Shift+F8: select the next or previous problem, wrapping around. */
  const goToProblem = useCallback(
    (direction: 1 | -1): void => {
      const textarea = textareaRef.current;
      const problems = diagnostics.problems
        .filter((problem) => problem.severity !== "hint")
        .sort((a, b) => a.start - b.start);
      if (!textarea || problems.length === 0) return;
      const cursor = textarea.selectionStart;
      const target =
        direction > 0
          ? (problems.find((problem) => problem.start > cursor) ?? problems[0])
          : ([...problems].reverse().find((problem) => problem.start < cursor) ??
            problems[problems.length - 1]);
      revealRange(target.start, Math.max(target.start, target.end));
    },
    [diagnostics.problems, revealRange]
  );

  // Editor commands require focus inside the editor, as in VS Code.
  const handleEditorKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>): void => {
      // VS Code hides the hover on any key except bare modifiers (Cmd stays for Cmd+click).
      if (!MODIFIER_KEYS.has(e.key)) hoverSignatures.closeHover();
      if (e.altKey && !e.shiftKey && !e.metaKey && !e.ctrlKey && matchesKey(e, "KeyZ")) {
        e.preventDefault();
        toggleWordWrap();
        return;
      }
      if (e.altKey && e.shiftKey && !e.metaKey && !e.ctrlKey && matchesKey(e, "KeyF")) {
        e.preventDefault();
        void handleFormat();
        return;
      }
      // One Escape closes one widget: an open suggest list has already taken it.
      if (e.key === "Escape" && !e.defaultPrevented && signatureHelp.signature) {
        e.preventDefault();
        signatureHelp.close();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.code === "Space") {
        e.preventDefault();
        signatureHelp.trigger();
        return;
      }
      // Find, replace, go to line (Cmd/Ctrl+F, Cmd/Ctrl+H, Ctrl+G, F3); Escape closes the panel.
      if (find.handleShortcut(e)) return;
      if (e.key === "F12" && textareaRef.current) {
        e.preventDefault();
        void goToDefinition(textareaRef.current.selectionStart);
        return;
      }
      if (e.key === "F8" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        goToProblem(e.shiftKey ? -1 : 1);
        return;
      }
      // Cmd/Ctrl+. moves focus to the quick fixes, as VS Code opens its light bulb.
      if ((e.metaKey || e.ctrlKey) && e.code === "Period" && firstQuickFixRef.current) {
        e.preventDefault();
        firstQuickFixRef.current.focus();
      }
    },
    [
      handleFormat,
      toggleWordWrap,
      goToProblem,
      goToDefinition,
      signatureHelp,
      hoverSignatures,
      find,
    ]
  );

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent): void => {
      if (e.defaultPrevented) return;
      // Only the editor the user is in reacts: several mounted editors would toggle each
      // other back, and F11 elsewhere on the page keeps the browser's own fullscreen.
      const root = wrapperRef.current;
      if (!root || !(root.contains(document.activeElement) || root.matches(":hover"))) return;
      if (e.key === "F11" || (e.key === "Escape" && effectiveFullscreen)) {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [effectiveFullscreen, toggleFullscreen]);

  const highlightedCode = useMemo(
    () =>
      highlightCode(code + "\n", filepath, {
        problems: diagnostics.problems,
      }),
    [code, filepath, diagnostics.problems]
  );
  const lineCount = useMemo(() => code.split("\n").length, [code]);
  const lineHeights = useWrappedLineHeights(textareaRef, wordWrap, `${code}:${fontSize}`);
  const bracketPair = useMemo(
    () => findMatchingBracketPair(code, cursorPos.offset) ?? [],
    [code, cursorPos.offset]
  );
  const secondaryCarets = useMemo(() => {
    const collapsed = multiCursor.selections.filter(({ start, end }) => start === end);
    return collapsed.length > 1 ? collapsed.map(({ start }) => start) : [];
  }, [multiCursor.selections]);

  const [isScrolling, setIsScrolling] = useState(false);
  const isScrollingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = () => {
    if (textareaRef.current) {
      const top = textareaRef.current.scrollTop;
      const left = textareaRef.current.scrollLeft;
      if (highlightRef.current) {
        highlightRef.current.scrollTop = top;
        highlightRef.current.scrollLeft = left;
      }
      if (gutterRef.current) {
        gutterRef.current.scrollTop = top;
      }
      if (intelliSense.isOpen) {
        intelliSense.updatePosition(textareaRef.current);
      }
    }
    signatureHelp.updatePosition();
    hoverSignatures.closeHover();
    setIsScrolling(true);
    if (isScrollingTimeoutRef.current) clearTimeout(isScrollingTimeoutRef.current);
    isScrollingTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 800);
  };

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (isScrollingTimeoutRef.current) clearTimeout(isScrollingTimeoutRef.current);
    };
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;
    // A native edit (cut, drop, IME, undo) moved offsets under the extra cursors.
    if (multiCursor.hasMultipleCursors) multiCursor.clearSelections();
    let val = e.target.value;
    let pos = e.target.selectionStart;
    const input = e.nativeEvent;
    const isTyping =
      input instanceof InputEvent && !input.isComposing && input.inputType === "insertText";
    if (input instanceof InputEvent && !input.isComposing) {
      const edit = getLinkedTagEdit(code, val, pos, filepath);
      if (edit) {
        val = edit.newCode;
        pos = edit.newCursor;
        e.target.value = val;
        e.target.setSelectionRange(pos, pos);
      }
    }
    if (isTyping && input.data === ">") {
      const edit = getAutoCloseTagEdit(val, pos, filepath);
      if (edit) {
        val = edit.newCode;
        pos = edit.newCursor;
        e.target.value = val;
        e.target.setSelectionRange(pos, pos);
      }
    }
    onChange(val);
    history.pushHistory(
      val,
      pos,
      input instanceof InputEvent ? { inputType: input.inputType, data: input.data } : undefined
    );
    updateCursorCoords();
    markSaving();

    if (textareaRef.current) {
      if (isTyping) {
        intelliSense.openCompletions(val, pos, textareaRef.current);
      } else {
        intelliSense.closeCompletions();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (multiCursor.hasMultipleCursors) {
      const text = e.clipboardData.getData("text");
      if (text) {
        e.preventDefault();
        multiCursor.handleMultiPaste(text, code, applyEdit);
      }
    }
  };

  const handleTextareaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    snippetSession.cancel();
    if (e.metaKey || e.ctrlKey) {
      void goToDefinition(e.currentTarget.selectionStart);
    }
    updateCursorCoords();
    intelliSense.closeCompletions();
    multiCursor.clearSelections();
  };

  const handleTextareaBlur = () => {
    intelliSense.closeCompletions();
    signatureHelp.close();
  };

  const handleCursorKeyUp = () => {
    updateCursorCoords();
    if (textareaRef.current) {
      intelliSense.handleCursorMove(code, textareaRef.current.selectionStart, textareaRef.current);
    }
  };

  const applyQuickFix = (index: number): void => {
    const fix = diagnostics.quickFixes[index];
    if (!fix || readOnly) return;
    const { code: fixed, mapOffset } = applyTextChanges(code, fix.changes);
    applyEdit(fixed, mapOffset(textareaRef.current?.selectionStart ?? 0));
  };

  const langInfo = useMemo(() => getLanguageInfo(filepath), [filepath]);

  return {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    wrapperRef,
    textareaRef,
    highlightRef,
    gutterRef,
    wordWrap,
    setWordWrap,
    toggleWordWrap,
    hideTooltips,
    effectiveFullscreen,
    toggleFullscreen,
    cursorPos,
    saveStatus,
    history,
    intelliSense,
    hoverSignatures,
    signatureHelp,
    multiCursor,
    find,
    diagnostics,
    firstQuickFixRef,
    applyQuickFix,
    goToProblem,
    requestRename: typeScriptAnalysis.requestRename,
    isAnalysisPending: typeScriptAnalysis.isPending,
    highlightedCode,
    lineCount,
    lineHeights,
    bracketPair,
    secondaryCarets,
    langInfo,
    isScrolling,
    isLinterEnabled,
    handleToggleLinter,
    handleFormat,
    formatNotice,
    applyEdit,
    applyCompletion,
    restoreEntry,
    selectAfterRender,
    updateCursorCoords,
    handleScroll,
    handleTextChange,
    handlePaste,
    handleTextareaClick,
    handleTextareaBlur,
    handleCursorKeyUp,
    handleEditorKeyDown,
    handleKeyDown,
  };
};
