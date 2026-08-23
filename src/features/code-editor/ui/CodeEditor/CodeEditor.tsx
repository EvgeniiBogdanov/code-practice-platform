import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Check, CheckCircle2, AlertCircle, Code2 } from "lucide-react";
import {
  highlightJS,
  lintJavaScriptCode,
  formatJavaScriptCode,
  fixTypoInCode,
  addImportToFile,
  type TaskFile,
} from "@/shared/lib/code-editor";
import { Tooltip } from "@/shared/ui";
import { useUIStore } from "@/entities/ui-state";
import { useCodeHistory } from "../../model/useCodeHistory";
import { useIntelliSense } from "../../model/useIntelliSense";
import { useHoverSignatures } from "../../model/useHoverSignatures";
import { useEditorKeyHandlers } from "../../model/useEditorKeyHandlers";
import { useFindReplace } from "../../model/useFindReplace";
import { LineNumbers } from "../LineNumbers";
import { EditorToolbar } from "../EditorToolbar";
import { FindReplaceWidget } from "../FindReplaceWidget";
import { QuickFixBanner } from "../QuickFixBanner";
import { SuggestionsDropdown } from "../SuggestionsDropdown";
import { HoverSignatureCard } from "../HoverSignatureCard";
import styles from "./CodeEditor.module.css";

export interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  onRun?: () => void;
  onReset?: () => void;
  files?: TaskFile[];
  activeFileIdx?: number;
  onFileSelect?: (idx: number) => void;
  filepath?: string;
  isModified?: boolean;
  readOnly?: boolean;
  bottomConsole?: React.ReactNode;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  className?: string;
}

export function CodeEditor({
  code,
  onChange,
  onRun,
  onReset,
  files = [],
  activeFileIdx = 0,
  onFileSelect,
  filepath = "main.jsx",
  isModified,
  readOnly = false,
  bottomConsole,
  isFullscreen,
  onToggleFullscreen,
  className,
}: CodeEditorProps) {
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
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
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

  // Global hotkeys for Find (Ctrl+F/Ctrl+H), Fullscreen (F11/Esc), Format (Shift+Alt+F), WordWrap (Alt+Z)
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

  // Linting problems, typos, and missing imports
  const lintResult = useMemo(
    () => lintJavaScriptCode(code, { files, filepath }),
    [code, files, filepath]
  );

  const activeTypo = useMemo(() => {
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

  const activeMissingImport = useMemo(() => {
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

  const handleFixTypo = (typo: { line: number; typo: string; correct: string }) => {
    const fixed = fixTypoInCode(code, typo.line, typo.typo, typo.correct);
    onChange(fixed);
    history.pushHistory(fixed);
    if (textareaRef.current) {
      textareaRef.current.value = fixed;
      textareaRef.current.focus();
    }
  };

  const handleFixMissingImport = (imp: { symbol: string; module: string; isDefault?: boolean }) => {
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

  const getLanguageInfo = () => {
    const ext = filepath.split(".").pop()?.toLowerCase();
    if (ext === "jsx" || ext === "tsx") {
      return { name: "React JSX", iconClass: styles.langIconReact };
    }
    if (ext === "ts") {
      return { name: "TypeScript", iconClass: styles.langIconTs };
    }
    if (ext === "html") {
      return { name: "HTML", iconClass: styles.langIconOther };
    }
    if (ext === "css") {
      return { name: "CSS", iconClass: styles.langIconOther };
    }
    return { name: "JavaScript", iconClass: styles.langIconJs };
  };

  const langInfo = getLanguageInfo();

  return (
    <div
      className={[styles.editorWrapper, effectiveFullscreen && styles.fullscreen, className]
        .filter(Boolean)
        .join(" ")}
      style={{
        ["--editor-font-size" as any]: `${fontSize}px`,
      }}
    >
      <Tooltip.Provider delayDuration={600} skipDelayDuration={300}>
        <EditorToolbar
          files={files}
          activeFileIdx={activeFileIdx}
          onFileSelect={onFileSelect}
          filepath={filepath}
          canUndo={history.canUndo}
          canRedo={history.canRedo}
          onUndo={() => {
            const res = history.undo(code);
            if (res) onChange(res.code);
          }}
          onRedo={() => {
            const res = history.redo(code);
            if (res) onChange(res.code);
          }}
          onFormat={handleFormat}
          wordWrap={wordWrap}
          onToggleWordWrap={() => setWordWrap((prev) => !prev)}
          isFindOpen={findReplace.findState.isOpen}
          onToggleFind={() => {
            if (findReplace.findState.isOpen) findReplace.closeFind();
            else findReplace.openFind(false);
          }}
          onReset={onReset}
          isModified={isModified}
          onIncreaseFontSize={increaseFontSize}
          onDecreaseFontSize={decreaseFontSize}
          fontSize={fontSize}
          codeText={code}
          isFullscreen={effectiveFullscreen}
          onToggleFullscreen={toggleFullscreen}
          readOnly={readOnly}
        />

        {/* QuickFix Banner for typos and missing imports */}
        {!readOnly && (
          <QuickFixBanner
            activeTypo={activeTypo}
            activeMissingImport={activeMissingImport}
            onFixTypo={handleFixTypo}
            onFixMissingImport={handleFixMissingImport}
          />
        )}

        <div className={styles.editorBody}>
          {/* Floating Find & Replace Widget */}
          <FindReplaceWidget
            findState={findReplace.findState}
            findMatches={findReplace.findMatches}
            findInputRef={findReplace.findInputRef}
            replaceInputRef={findReplace.replaceInputRef}
            onClose={findReplace.closeFind}
            onFindNext={findReplace.findNext}
            onFindPrev={findReplace.findPrev}
            onReplaceCurrent={findReplace.replaceCurrent}
            onReplaceAll={findReplace.replaceAllMatches}
            onSetQuery={findReplace.setQuery}
            onSetReplaceText={findReplace.setReplaceText}
            onToggleShowReplace={findReplace.toggleShowReplace}
            onToggleMatchCase={findReplace.toggleMatchCase}
            onToggleMatchWholeWord={findReplace.toggleMatchWholeWord}
            onToggleUseRegex={findReplace.toggleUseRegex}
          />

          <LineNumbers
            ref={gutterRef}
            lineCount={lineCount}
            activeLine={cursorPos.line}
            errorLines={errorLines}
            warningLines={warningLines}
            fontSize={fontSize}
          />

          <div className={styles.textLayersWrapper}>
            <pre
              ref={highlightRef}
              className={[styles.highlightLayer, wordWrap && styles.wrapOn]
                .filter(Boolean)
                .join(" ")}
              aria-hidden="true"
            >
              <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
            </pre>

            <textarea
              ref={textareaRef}
              value={code}
              onChange={handleTextChange}
              onKeyDown={(e) => {
                handleKeyDown(e);
                setTimeout(updateCursorCoords, 0);
              }}
              onKeyUp={updateCursorCoords}
              onClick={updateCursorCoords}
              onScroll={handleScroll}
              onMouseMove={(e) => hoverSignatures.handleMouseMove(e, code)}
              onMouseLeave={hoverSignatures.handleMouseLeave}
              className={[styles.textarea, wordWrap && styles.wrapOn].filter(Boolean).join(" ")}
              placeholder="// Напишите ваш код решения здесь..."
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
            />

            {intelliSense.isOpen && (
              <SuggestionsDropdown
                items={intelliSense.items}
                selectedIndex={intelliSense.selectedIndex}
                position={intelliSense.popupPosition}
                onSelect={() => {
                  if (textareaRef.current) {
                    const applied = intelliSense.applySelected(
                      code,
                      textareaRef.current.selectionStart
                    );
                    if (applied) {
                      onChange(applied.newCode);
                      history.pushHistory(applied.newCode, applied.newCursor);
                    }
                  }
                }}
              />
            )}

            {hoverSignatures.hoverInfo && (
              <HoverSignatureCard
                info={hoverSignatures.hoverInfo}
                position={hoverSignatures.position}
              />
            )}
          </div>
        </div>

        {/* Bottom Console mounted between editor body and status bar */}
        {bottomConsole && <div className={styles.bottomConsoleWrapper}>{bottomConsole}</div>}

        {/* VS Code Status Bar */}
        <div className={styles.statusBar}>
          <div className={styles.statusLeft}>
            {!readOnly && (
              <Tooltip
                content={
                  saveStatus === "saving"
                    ? "Автосохранение в IndexedDB..."
                    : "Решение сохранено локально в IndexedDB"
                }
                side="top"
              >
                <span
                  className={[
                    styles.statusItem,
                    styles.saveIndicator,
                    saveStatus === "saving" && styles.saveIndicatorSaving,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {saveStatus === "saving" ? (
                    <>
                      <span className={styles.savePulseDot} />
                      <span>Сохранение...</span>
                    </>
                  ) : (
                    <>
                      <Check size={11} />
                      <span>Сохранено</span>
                    </>
                  )}
                </span>
              </Tooltip>
            )}

            <span className={styles.statusSep}>|</span>

            {lintResult.errorCount > 0 ? (
              <Tooltip
                content="Обнаружена ошибка синтаксиса, типов или отсутствующий импорт"
                side="top"
              >
                <span className={[styles.statusItem, styles.diagErr].join(" ")}>
                  <AlertCircle size={11} />
                  <span>
                    {lintResult.errorCount} {lintResult.errorCount === 1 ? "ошибка" : "ошибок"}
                    {activeTypo
                      ? `: ${activeTypo.typo} → ${activeTypo.correct}`
                      : activeMissingImport
                        ? `: не импортирован '${activeMissingImport.symbol}'`
                        : ""}
                  </span>
                </span>
              </Tooltip>
            ) : (
              <Tooltip content="Синтаксис и типы корректны" side="top">
                <span className={[styles.statusItem, styles.diagOk].join(" ")}>
                  <CheckCircle2 size={11} />
                  <span>Синтаксис корректен</span>
                </span>
              </Tooltip>
            )}

            <span className={styles.statusSep}>|</span>

            <span className={styles.statusItem}>
              Стр {cursorPos.line}, Кол {cursorPos.col}
            </span>
            <span className={styles.statusSep}>|</span>
            <span className={styles.statusItem}>
              {lineCount} {lineCount === 1 ? "строка" : lineCount < 5 ? "строки" : "строк"} (
              {code.length} симв)
            </span>
          </div>

          <div className={styles.statusRight}>
            <span className={styles.statusItem}>Пробелы: 2</span>
            <span className={styles.statusSep}>|</span>
            <span className={styles.statusItem}>UTF-8</span>
            <span className={styles.statusSep}>|</span>
            <Tooltip content={`Язык синтаксиса: ${langInfo.name}`} side="top">
              <span className={styles.statusItem}>
                <Code2 size={11} className={langInfo.iconClass} />
                <span>{langInfo.name}</span>
              </span>
            </Tooltip>
          </div>
        </div>
      </Tooltip.Provider>
    </div>
  );
}
