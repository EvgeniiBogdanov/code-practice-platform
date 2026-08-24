import React from "react";
import { Check, CheckCircle2, AlertCircle, Code2 } from "lucide-react";
import { Tooltip } from "@/shared/ui";
import { useCodeEditor } from "../../model/use-code-editor";
import { CodeEditorProps } from "../../model/types";
import { LineNumbers } from "../LineNumbers";
import { EditorToolbar } from "../EditorToolbar";
import { FindReplaceWidget } from "../FindReplaceWidget";
import { QuickFixBanner } from "../QuickFixBanner";
import { SuggestionsDropdown } from "../SuggestionsDropdown";
import { HoverSignatureCard } from "../HoverSignatureCard";
import styles from "./CodeEditor.module.css";

export type { CodeEditorProps };

export const CodeEditor = ({
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
}: CodeEditorProps): React.JSX.Element => {
  const {
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
  } = useCodeEditor({
    code,
    onChange,
    onRun,
    files,
    filepath,
    readOnly,
    isFullscreen,
    onToggleFullscreen,
  });

  return (
    <div
      className={[styles.editorWrapper, effectiveFullscreen && styles.fullscreen, className]
        .filter(Boolean)
        .join(" ")}
      style={{ "--editor-font-size": `${fontSize}px` } as React.CSSProperties}
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

        {!readOnly && (
          <QuickFixBanner
            activeTypo={activeTypo}
            activeMissingImport={activeMissingImport}
            onFixTypo={handleFixTypo}
            onFixMissingImport={handleFixMissingImport}
          />
        )}

        <div className={styles.editorBody}>
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

        {bottomConsole && <div className={styles.bottomConsoleWrapper}>{bottomConsole}</div>}

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
};
