import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  highlightJS,
  lintJavaScriptCode,
  formatJavaScriptCode,
  fixTypoInCode,
  addImportToFile,
} from "@/shared/lib/code-editor";
import { useUIStore } from "@/entities/ui-state";
import { useCodeHistory } from "./useCodeHistory";
import { useIntelliSense } from "./useIntelliSense";
import { useHoverSignatures } from "./useHoverSignatures";
import { useEditorKeyHandlers } from "./useEditorKeyHandlers";
import { useFindReplace } from "./useFindReplace";
import { CodeEditorProps, CursorPosition, TypoInfo, MissingImportInfo } from "./types";
import { getLanguageInfo } from "../lib/editor-utils";

export const useCodeEditor = ({
  code,
  onChange,
  onRun,
  files = [],
  filepath = "main.jsx",
  readOnly = false,
  isFullscreen,
  onToggleFullscreen,
}: CodeEditorProps) => {
  const fontSize = useUIStore((state) => state.editorFontSize);
  const increaseFontSize = useUIStore((state) => state.increaseEditorFontSize);
  const decreaseFontSize = useUIStore((state) => state.decreaseEditorFontSize);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const [wordWrap, setWordWrap] = useState(false);
  const [internalFullscreen, setInternalFullscreen] = useState(false);
  const effectiveFullscreen = isFullscreen !== undefined ? isFullscreen : internalFullscreen;
  const toggleFullscreen = onToggleFullscreen || (() => setInternalFullscreen((prev) => !prev));
  const [cursorPos, setCursorPos] = useState<CursorPosition>({ line: 1, col: 1 });
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const history = useCodeHistory(code);
  const intelliSense = useIntelliSense(files, filepath);
  const hoverSignatures = useHoverSignatures();

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

  const findReplace = useFindReplace({
    code,
    onChange: (val) => {
      onChange(val);
      history.pushHistory(val);
      setSaveStatus("saving");
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => setSaveStatus("saved"), 450);
    },
    textareaRef,
    readOnly,
  });

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
    onRun,
  });

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        findReplace.openFind(false);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "h") {
        e.preventDefault();
        findReplace.openFind(true);
        return;
      }
      if (e.key === "F11") {
        e.preventDefault();
        toggleFullscreen();
        return;
      }
      if (e.key === "Escape") {
        if (findReplace.findState.isOpen) {
          e.preventDefault();
          findReplace.closeFind();
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
        setWordWrap((prev) => !prev);
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
  }, [findReplace, handleFormat, effectiveFullscreen, toggleFullscreen]);

  const lintResult = useMemo(
    () => lintJavaScriptCode(code, { files, filepath }),
    [code, files, filepath]
  );

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
      highlightJS(code + "\n", {
        problems: lintResult.problems,
        highlightWord:
          findReplace.findState.isOpen && findReplace.findState.query
            ? findReplace.findState.query
            : undefined,
      }),
    [code, findReplace.findState.isOpen, findReplace.findState.query, lintResult.problems]
  );
  const lineCount = useMemo(() => code.split("\n").length, [code]);

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
    effectiveFullscreen,
    toggleFullscreen,
    cursorPos,
    saveStatus,
    history,
    intelliSense,
    hoverSignatures,
    findReplace,
    lintResult,
    activeTypo,
    activeMissingImport,
    errorLines,
    warningLines,
    highlightedCode,
    lineCount,
    langInfo,
    handleFormat,
    updateCursorCoords,
    handleScroll,
    handleTextChange,
    handleFixTypo,
    handleFixMissingImport,
    handleKeyDown,
  };
};
