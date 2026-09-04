import React, { useState, useMemo, useRef, useEffect, useCallback, useDeferredValue } from "react";
import {
  highlightCode,
  lintJavaScriptCode,
  formatJavaScriptCode,
  fixTypoInCode,
  addImportToFile,
  LintResult,
} from "@/shared/lib/code-editor";
import { useUIStore } from "@/entities/ui-state";
import { useCodeHistory } from "./useCodeHistory";
import { useIntelliSense } from "./useIntelliSense";
import { useHoverSignatures } from "./useHoverSignatures";
import { useEditorKeyHandlers } from "./useEditorKeyHandlers";
import { useMultiCursor } from "./useMultiCursor";
import { CodeEditorProps, CursorPosition, TypoInfo, MissingImportInfo } from "./types";
import { getLanguageInfo } from "../lib/editor-utils";

const EMPTY_LINT_RESULT: LintResult = {
  problems: [],
  errorCount: 0,
  warningCount: 0,
  isValid: true,
  typoMap: {},
  missingImportMap: {},
  allMissingImports: [],
  unusedImports: new Set<string>(),
};

export const useCodeEditor = ({
  code,
  onChange,
  onRun,
  files = [],
  filepath = "main.jsx",
  readOnly = false,
  isFullscreen,
  onToggleFullscreen,
  disableLinter = false,
}: CodeEditorProps) => {
  const fontSize = useUIStore((state) => state.editorFontSize);
  const increaseFontSize = useUIStore((state) => state.increaseEditorFontSize);
  const decreaseFontSize = useUIStore((state) => state.decreaseEditorFontSize);
  const wordWrap = useUIStore((state) => state.editorWordWrap);
  const setWordWrap = useUIStore((state) => state.setEditorWordWrap);
  const toggleWordWrap = useUIStore((state) => state.toggleEditorWordWrap);
  const hideTooltips = useUIStore((state) => state.hideTooltips);
  const deferredCode = useDeferredValue(code);
  const deferredFiles = useDeferredValue(files);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const [internalFullscreen, setInternalFullscreen] = useState(false);
  const effectiveFullscreen = isFullscreen !== undefined ? isFullscreen : internalFullscreen;
  const toggleFullscreen = useCallback(() => {
    if (onToggleFullscreen) {
      onToggleFullscreen();
    } else {
      setInternalFullscreen((prev) => !prev);
    }
  }, [onToggleFullscreen]);
  const [cursorPos, setCursorPos] = useState<CursorPosition>({ line: 1, col: 1 });
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const history = useCodeHistory(code);
  const intelliSense = useIntelliSense(files, filepath);
  const hoverSignatures = useHoverSignatures(filepath);
  const multiCursor = useMultiCursor();

  const handleFormat = useCallback(async () => {
    if (!code || readOnly) return;
    try {
      const formatted = await formatJavaScriptCode(code, filepath);
      if (formatted && formatted !== code) {
        onChange(formatted);
        history.pushHistory(formatted);
      }
    } catch {
      // ignore
    }
  }, [code, filepath, history, onChange, readOnly]);

  const updateCursorCoords = useCallback(() => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart;
    const textBefore = code.substring(0, pos);
    const line = textBefore.split("\n").length;
    const col = pos - textBefore.lastIndexOf("\n");
    setCursorPos({ line, col });
  }, [code]);

  const { handleKeyDown } = useEditorKeyHandlers({
    code,
    onChange: (val) => {
      onChange(val);
      history.pushHistory(val);
      setSaveStatus("saving");
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => setSaveStatus("saved"), 450);
    },
    intelliSense,
    history,
    multiCursor,
    onRun,
    readOnly,
  });

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === "F11") {
        e.preventDefault();
        toggleFullscreen();
        return;
      }
      if (e.key === "Escape") {
        if (intelliSense.isOpen) {
          e.preventDefault();
          intelliSense.closeCompletions();
          return;
        }
        if (effectiveFullscreen) {
          e.preventDefault();
          toggleFullscreen();
          return;
        }
      }
      if (e.altKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        toggleWordWrap();
        return;
      }
      if (e.shiftKey && e.altKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        handleFormat();
        return;
      }
    };

    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [handleFormat, effectiveFullscreen, toggleFullscreen, intelliSense, toggleWordWrap]);

  const lintResult = useMemo(() => {
    if (disableLinter) {
      return EMPTY_LINT_RESULT;
    }
    return lintJavaScriptCode(deferredCode, { files: deferredFiles, filepath });
  }, [disableLinter, deferredCode, deferredFiles, filepath]);
  const isAnalysisPending = !disableLinter && (deferredCode !== code || deferredFiles !== files);

  const activeTypo = useMemo((): TypoInfo | null => {
    if (lintResult.typoMap && lintResult.typoMap[cursorPos.line]) {
      const p = lintResult.typoMap[cursorPos.line];
      return { line: p.line, typo: p.typo || "", correct: p.correct || "" };
    }
    const first = lintResult.problems.find((p) => p.rule === "keyword-typo");
    if (first) {
      return { line: first.line, typo: first.typo || "", correct: first.correct || "" };
    }
    return null;
  }, [cursorPos.line, lintResult.problems, lintResult.typoMap]);

  const activeMissingImport = useMemo((): MissingImportInfo | null => {
    if (lintResult.missingImportMap && lintResult.missingImportMap[cursorPos.line]) {
      const p = lintResult.missingImportMap[cursorPos.line];
      return {
        line: p.line,
        symbol: p.symbol || "",
        module: p.module || "react",
        isDefault: p.isDefault,
      };
    }
    if (lintResult.allMissingImports && lintResult.allMissingImports.length > 0) {
      const first = lintResult.allMissingImports[0];
      return {
        line: first.line,
        symbol: first.symbol || "",
        module: first.module || "react",
        isDefault: first.isDefault,
      };
    }
    return null;
  }, [cursorPos.line, lintResult.allMissingImports, lintResult.missingImportMap]);

  const errorLines = useMemo(
    () =>
      new Set<number>(lintResult.problems.filter((p) => p.severity === "error").map((e) => e.line)),
    [lintResult.problems]
  );
  const warningLines = useMemo(
    () =>
      new Set<number>(
        lintResult.problems.filter((p) => p.severity === "warning").map((w) => w.line)
      ),
    [lintResult.problems]
  );

  const highlightedCode = useMemo(
    () =>
      highlightCode(code + "\n", filepath, {
        problems: lintResult.problems,
        multiSelections: multiCursor.selections,
      }),
    [code, filepath, lintResult.problems, multiCursor.selections]
  );
  const lineCount = useMemo(() => code.split("\n").length, [code]);

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
    }
    setIsScrolling(true);
    if (isScrollingTimeoutRef.current) clearTimeout(isScrollingTimeoutRef.current);
    isScrollingTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 800);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const pos = e.target.selectionStart;
    onChange(val);
    history.pushHistory(val, pos);
    updateCursorCoords();
    setSaveStatus("saving");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => setSaveStatus("saved"), 450);

    if (textareaRef.current) {
      intelliSense.openCompletions(val, pos, textareaRef.current);
      hoverSignatures.updateSignatureHelp(val, pos);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (multiCursor.hasMultipleCursors) {
      const text = e.clipboardData.getData("text");
      if (text) {
        e.preventDefault();
        multiCursor.handleMultiPaste(text, code, onChange, history, textareaRef.current);
      }
    }
  };

  const handleTextareaClick = () => {
    updateCursorCoords();
    intelliSense.closeCompletions();
    multiCursor.clearSelections();
  };

  const handleTextareaBlur = () => {
    intelliSense.closeCompletions();
  };

  const handleCursorKeyUp = () => {
    updateCursorCoords();
    if (textareaRef.current) {
      intelliSense.handleCursorMove(code, textareaRef.current.selectionStart, textareaRef.current);
    }
  };

  const handleFixTypo = (typo: TypoInfo) => {
    const fixed = fixTypoInCode(code, typo.line, typo.typo, typo.correct);
    onChange(fixed);
    history.pushHistory(fixed);
    if (textareaRef.current) {
      textareaRef.current.value = fixed;
      textareaRef.current.focus();
    }
  };

  const handleFixMissingImport = (imp: MissingImportInfo) => {
    const res = addImportToFile(code, imp.symbol, imp.module, imp.isDefault);
    if (res.insertedLength > 0 && res.newCode) {
      onChange(res.newCode);
      history.pushHistory(res.newCode);
      if (textareaRef.current) {
        textareaRef.current.value = res.newCode;
        textareaRef.current.focus();
      }
    }
  };

  const langInfo = useMemo(() => getLanguageInfo(filepath), [filepath]);

  return {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
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
    multiCursor,
    lintResult,
    isAnalysisPending,
    activeTypo,
    activeMissingImport,
    errorLines,
    warningLines,
    highlightedCode,
    lineCount,
    langInfo,
    isScrolling,
    handleFormat,
    updateCursorCoords,
    handleScroll,
    handleTextChange,
    handlePaste,
    handleTextareaClick,
    handleTextareaBlur,
    handleCursorKeyUp,
    handleFixTypo,
    handleFixMissingImport,
    handleKeyDown,
  };
};
