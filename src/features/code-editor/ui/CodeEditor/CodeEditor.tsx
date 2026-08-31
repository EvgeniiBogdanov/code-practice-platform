import React from "react";
import { Check, CheckCircle2, AlertCircle, Code2 } from "lucide-react";
import { clsx } from "clsx";
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
  fillHeight = false,
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
    toggleWordWrap,
    effectiveFullscreen,
    toggleFullscreen,
    cursorPos,
    saveStatus,
    history,
    intelliSense,
    hoverSignatures,
    findReplace,
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
      className={clsx(
        styles.editorWrapper,
        effectiveFullscreen && !fillHeight && styles.fullscreen,
        fillHeight && styles.fillHeight,
        intelliSense.isOpen && styles.hasOpenDropdown,
        className
      )}
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
          onToggleWordWrap={toggleWordWrap}
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

        {!readOnly && !isAnalysisPending && (
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
              className={clsx(styles.highlightLayer, wordWrap && styles.wrapOn)}
              aria-hidden="true"
            >
              <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
            </pre>

            <textarea
              ref={textareaRef}
              value={code}
              onChange={handleTextChange}
              onPaste={handlePaste}
              onKeyDown={(e) => {
                handleKeyDown(e);
                setTimeout(updateCursorCoords, 0);
              }}
              onKeyUp={handleCursorKeyUp}
              onClick={handleTextareaClick}
              onBlur={handleTextareaBlur}
              onScroll={handleScroll}
              onMouseMove={(e) => hoverSignatures.handleMouseMove(e, code)}
              onMouseLeave={hoverSignatures.handleMouseLeave}
              className={clsx(
                styles.textarea,
                isScrolling && styles.isScrolling,
                wordWrap && styles.wrapOn
              )}
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
                onHover={intelliSense.selectIndex}
                onSelect={(item) => {
                  if (textareaRef.current) {
                    const applied = intelliSense.applySelected(
                      code,
                      textareaRef.current.selectionStart,
                      files,
                      filepath,
                      item
                    );
                    if (applied) {
                      onChange(applied.newCode);
                      history.pushHistory(applied.newCode, applied.newCursor);
                      setTimeout(() => {
                        if (textareaRef.current) {
                          textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
                            applied.newCursor;
                          textareaRef.current.focus();
                          updateCursorCoords();
                        }
                      }, 0);
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

        <QuickFixBanner
          activeTypo={activeTypo}
          activeMissingImport={activeMissingImport}
          onFixTypo={handleFixTypo}
          onFixMissingImport={handleFixMissingImport}
        />

        {findReplace.findState.isOpen && (
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
        )}

        {bottomConsole && <div className={styles.bottomConsoleWrapper}>{bottomConsole}</div>}

        <div className={styles.statusBar}>
          <div className={styles.statusLeft}>
            {saveStatus && (
              <Tooltip
                content={
                  saveStatus === "saving"
                    ? "Сохранение вашего прогресса..."
                    : "Решение автоматически сохранено в браузере"
                }
                side="top"
              >
                <span
                  className={clsx(
                    styles.statusItem,
                    styles.saveIndicator,
                    saveStatus === "saving" && styles.saveIndicatorSaving
                  )}
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
                <span className={clsx(styles.statusItem, styles.diagErr)}>
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
                <span className={clsx(styles.statusItem, styles.diagOk)}>
                  <CheckCircle2 size={11} />
                  <span>Синтаксис корректен</span>
                </span>
              </Tooltip>
            )}

            <span className={styles.statusSep}>|</span>

            {multiCursor.hasMultipleCursors && (
              <>
                <Tooltip
                  content="Активно мульти-выделение (Cmd+D / Ctrl+D). Нажмите Esc для сброса."
                  side="top"
                >
                  <span className={clsx(styles.statusItem, styles.multiCursorIndicator)}>
                    <span className={styles.savePulseDot} />
                    <span>{multiCursor.selections.length} выделений</span>
                  </span>
                </Tooltip>
                <span className={styles.statusSep}>|</span>
              </>
            )}

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
