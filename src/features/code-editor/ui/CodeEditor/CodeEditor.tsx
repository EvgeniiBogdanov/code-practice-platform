import React from "react";
import { Check, CheckCircle2, AlertCircle, Code2 } from "lucide-react";
import { clsx } from "clsx";
import { Tooltip } from "@/shared/ui";
import { useCodeEditor } from "../../model/use-code-editor";
import { CodeEditorProps } from "../../model/types";
import { LineNumbers } from "../LineNumbers";
import { EditorToolbar } from "../EditorToolbar";
import { QuickFixBanner } from "../QuickFixBanner";
import { SuggestionsDropdown } from "../SuggestionsDropdown";
import { HoverSignatureCard } from "../HoverSignatureCard";
import styles from "./CodeEditor.module.css";
import { applyRenameEdits } from "../../lib/rename-symbol";

export type { CodeEditorProps };

export const CodeEditor = ({
  code,
  onChange,
  onFilesChange,
  onRun,
  onReset,
  files = [],
  activeFileIdx = 0,
  onFileSelect,
  filepath = "main.jsx",
  historyScope,
  isModified,
  readOnly = false,
  bottomConsole,
  isFullscreen,
  onToggleFullscreen,
  onPreloadFullscreen,
  isFullscreenTransitioning = false,
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
    requestRename,
    isAnalysisPending,
    activeTypo,
    activeMissingImport,
    errorLines,
    warningLines,
    highlightedCode,
    lineCount,
    langInfo,
    isScrolling,
    isLinterEnabled,
    handleToggleLinter,
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
    historyScope,
    readOnly,
    isFullscreen,
    onToggleFullscreen,
  });

  const applyHistoryEntry = (entry: { code: string; cursor: number } | null): void => {
    if (!entry || readOnly) return;
    multiCursor.clearSelections();
    onChange(entry.code);
    setTimeout(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.focus();
      textarea.setSelectionRange(entry.cursor, entry.cursor);
      updateCursorCoords();
    }, 0);
  };

  const handleRename = async (): Promise<void> => {
    const cursor = textareaRef.current?.selectionStart;
    if (readOnly || cursor === undefined) return;
    const edits = await requestRename(cursor);
    const currentEdit = edits.find(
      (edit) => edit.filepath === filepath && edit.start <= cursor && cursor <= edit.end
    );
    if (!currentEdit) return;
    const oldName = code.slice(currentEdit.start, currentEdit.end);
    const isTag = edits.length === 2 && edits.every((edit) => {
      if (edit.filepath !== filepath) return false;
      const before = code.slice(Math.max(0, edit.start - 2), edit.start);
      return before.endsWith("<") || before.endsWith("</");
    });
    const nextName = window.prompt("Новое имя", oldName)?.trim();
    if (!nextName || nextName === oldName) return;
    const valid = isTag
      ? /^[A-Za-z][\w.:-]*$/.test(nextName)
      : /^[A-Za-z_$][\w$]*$/.test(nextName);
    if (!valid) return;
    const currentFiles = files.length
      ? files.map((file) => ({
          name: file.name ?? file.filepath ?? "",
          code: (file.name ?? file.filepath) === filepath ? code : (file.code ?? ""),
        }))
      : [{ name: filepath, code }];
    const renamed = applyRenameEdits(currentFiles, edits, nextName);
    const active = renamed.find((file) => file.name === filepath);
    if (!active) return;
    if (renamed.some((file) => file.name !== filepath && file.code !== currentFiles.find((item) => item.name === file.name)?.code)) {
      if (!onFilesChange) return;
      onFilesChange(renamed);
    } else {
      onChange(active.code);
    }
    history.pushHistory(active.code, currentEdit.start + nextName.length);
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(
        currentEdit.start,
        currentEdit.start + nextName.length
      );
    }, 0);
  };

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
          onUndo={() => applyHistoryEntry(history.undo(code))}
          onRedo={() => applyHistoryEntry(history.redo(code))}
          isLinterEnabled={isLinterEnabled}
          onToggleLinter={handleToggleLinter}
          onFormat={handleFormat}
          wordWrap={wordWrap}
          onToggleWordWrap={toggleWordWrap}
          onReset={onReset}
          isModified={isModified}
          onIncreaseFontSize={increaseFontSize}
          onDecreaseFontSize={decreaseFontSize}
          fontSize={fontSize}
          codeText={code}
          isFullscreen={effectiveFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onPreloadFullscreen={onPreloadFullscreen}
          isFullscreenTransitioning={isFullscreenTransitioning}
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
              readOnly={readOnly}
              onBeforeInput={(e) => {
                const input = e.nativeEvent;
                if (input instanceof InputEvent && input.inputType === "historyUndo") {
                  e.preventDefault();
                  applyHistoryEntry(history.undo(code));
                  return;
                }
                if (input instanceof InputEvent && input.inputType === "historyRedo") {
                  e.preventDefault();
                  applyHistoryEntry(history.redo(code));
                  return;
                }
                history.captureCursor(e.currentTarget.selectionStart);
              }}
              onChange={handleTextChange}
              onPaste={handlePaste}
              onKeyDown={(e) => {
                if (e.key === "F2" && !readOnly) {
                  e.preventDefault();
                  void handleRename();
                  return;
                }
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

            {hoverSignatures.hoverInfo && !hideTooltips && (
              <HoverSignatureCard
                info={hoverSignatures.hoverInfo}
                position={hoverSignatures.position}
              />
            )}
            {hoverSignatures.signatureHelp && !hideTooltips && !intelliSense.isOpen && (
              <HoverSignatureCard
                info={{
                  symbol: hoverSignatures.signatureHelp.functionName,
                  signature: hoverSignatures.signatureHelp.signature,
                  documentation: hoverSignatures.signatureHelp.description,
                }}
                position={hoverSignatures.signaturePosition}
              />
            )}
          </div>
        </div>

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
