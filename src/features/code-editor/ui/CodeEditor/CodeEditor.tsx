import React, { useId } from "react";
import { Check, CheckCircle2, AlertCircle, Code2 } from "lucide-react";
import { clsx } from "clsx";
import { Tooltip } from "@/shared/ui";
import { canFormat, type LanguageId } from "@/shared/lib/code-editor";
import { useCodeEditor } from "../../model/useCodeEditor";
import { CodeEditorProps } from "../../model/types";
import { LineNumbers } from "../LineNumbers";
import { EditorToolbar } from "../EditorToolbar";
import { QuickFixBanner } from "../QuickFixBanner";
import { SuggestionsDropdown } from "../SuggestionsDropdown";
import { getSuggestionOptionId } from "../../lib/suggestionOptionId";
import { HoverSignatureCard } from "../HoverSignatureCard";
import { EditorDecorations } from "../EditorDecorations";
import { FindReplaceBar } from "../FindReplaceBar";
import { TextMarkLayer } from "../TextMarkLayer";
import { SignatureHelpCard } from "../SignatureHelpCard";
import styles from "./CodeEditor.module.css";
import { applyRenameEdits, getRenamedSelection } from "../../lib/renameSymbol";
import { TAB_SIZE, pluralize, type PluralForms } from "../../lib/editorUtils";

export type { CodeEditorProps };

const LANGUAGE_ICON_CLASSES: Record<LanguageId, string> = {
  javascript: styles.langIconJs,
  javascriptreact: styles.langIconJsx,
  typescript: styles.langIconTs,
  typescriptreact: styles.langIconTsx,
  css: styles.langIconCss,
  scss: styles.langIconCss,
  less: styles.langIconCss,
  html: styles.langIconHtml,
  json: styles.langIconJson,
  sql: styles.langIconSql,
  shellscript: styles.langIconOther,
  markdown: styles.langIconOther,
  plaintext: styles.langIconOther,
};
const ERROR_FORMS: PluralForms = { one: "ошибка", few: "ошибки", many: "ошибок" };
const LINE_FORMS: PluralForms = { one: "строка", few: "строки", many: "строк" };

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
  const suggestionsId = useId();
  const {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    wrapperRef,
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
    signatureHelp,
    multiCursor,
    find,
    diagnostics,
    firstQuickFixRef,
    applyQuickFix,
    goToProblem,
    requestRename,
    isAnalysisPending,
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
    onFileSelect,
  });

  const handleRename = async (): Promise<void> => {
    const cursor = textareaRef.current?.selectionStart;
    if (readOnly || cursor === undefined) return;
    const edits = await requestRename(cursor);
    const currentEdit = edits.find(
      (edit) => edit.filepath === filepath && edit.start <= cursor && cursor <= edit.end
    );
    if (!currentEdit) return;
    const oldName = code.slice(currentEdit.start, currentEdit.end);
    const isTag =
      edits.length === 2 &&
      edits.every((edit) => {
        if (edit.filepath !== filepath) return false;
        const before = code.slice(Math.max(0, edit.start - 2), edit.start);
        return before.endsWith("<") || before.endsWith("</");
      });
    const nextName = window.prompt("Новое имя", oldName)?.trim();
    if (!nextName || nextName === oldName) return;
    const valid = isTag ? /^[A-Za-z][\w.:-]*$/.test(nextName) : /^[A-Za-z_$][\w$]*$/.test(nextName);
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
    const renamedSelection = getRenamedSelection(edits, currentEdit, nextName);
    const touchesOtherFiles = renamed.some(
      (file) =>
        file.name !== filepath &&
        file.code !== currentFiles.find((item) => item.name === file.name)?.code
    );
    if (!touchesOtherFiles) {
      applyEdit(active.code, renamedSelection.start, renamedSelection.end);
      return;
    }
    if (!onFilesChange) return;
    selectAfterRender(renamedSelection.start, renamedSelection.end);
    onFilesChange(renamed);
    history.pushHistory(active.code, renamedSelection.end);
  };

  const isHoverVisible =
    (hoverSignatures.hoverInfo !== null || hoverSignatures.hoverProblems.length > 0) &&
    !hideTooltips &&
    !intelliSense.isOpen;

  return (
    <div
      ref={wrapperRef}
      className={clsx(
        styles.editorWrapper,
        effectiveFullscreen && !fillHeight && styles.fullscreen,
        fillHeight && styles.fillHeight,
        (intelliSense.isOpen || signatureHelp.signature || isHoverVisible) &&
          styles.hasOpenDropdown,
        className
      )}
      style={{ "--editor-font-size": `${fontSize}px` } as React.CSSProperties}
      onKeyDown={handleEditorKeyDown}
    >
      <Tooltip.Provider delayDuration={600} skipDelayDuration={300}>
        <EditorToolbar
          files={files}
          activeFileIdx={activeFileIdx}
          onFileSelect={onFileSelect}
          filepath={filepath}
          canUndo={history.canUndo}
          canRedo={history.canRedo}
          onUndo={() => restoreEntry(history.undo(code))}
          onRedo={() => restoreEntry(history.redo(code))}
          isLinterEnabled={isLinterEnabled}
          onToggleLinter={handleToggleLinter}
          onFormat={handleFormat}
          canFormat={canFormat(filepath)}
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
            diagnostic={diagnostics.activeDiagnostic}
            fixes={diagnostics.quickFixes}
            onApply={applyQuickFix}
            firstFixRef={firstQuickFixRef}
          />
        )}

        <div className={styles.editorBody}>
          <LineNumbers
            ref={gutterRef}
            lineCount={lineCount}
            activeLine={cursorPos.line}
            errorLines={diagnostics.errorLines}
            warningLines={diagnostics.warningLines}
            lineMessages={diagnostics.lineMessages}
            lineHeights={lineHeights}
            fontSize={fontSize}
          />

          <div className={styles.textLayersWrapper}>
            <pre
              ref={highlightRef}
              className={clsx(styles.highlightLayer, wordWrap && styles.wrapOn)}
              aria-hidden="true"
            >
              <TextMarkLayer
                code={code}
                variant="find"
                marks={find.highlights}
                active={find.activeMatch}
              />
              <TextMarkLayer code={code} variant="selection" marks={multiCursor.selections} />
              <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
              <EditorDecorations
                carets={secondaryCarets}
                brackets={bracketPair}
                textareaRef={textareaRef}
                layoutKey={`${code.length}:${fontSize}:${wordWrap}`}
              />
            </pre>

            <textarea
              ref={textareaRef}
              name="code-editor"
              value={code}
              readOnly={readOnly}
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
              onMouseDown={hoverSignatures.closeHover}
              onMouseMove={(e) => hoverSignatures.handleMouseMove(e, code)}
              onMouseLeave={hoverSignatures.handleMouseLeave}
              className={clsx(
                styles.textarea,
                isScrolling && styles.isScrolling,
                wordWrap && styles.wrapOn
              )}
              placeholder="// Напишите ваш код решения здесь..."
              aria-label="Редактор кода"
              aria-multiline="true"
              aria-autocomplete="list"
              aria-haspopup="listbox"
              aria-controls={intelliSense.isOpen ? suggestionsId : undefined}
              aria-activedescendant={
                intelliSense.isOpen
                  ? getSuggestionOptionId(suggestionsId, intelliSense.selectedIndex)
                  : undefined
              }
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
            />

            <FindReplaceBar find={find} readOnly={readOnly} />

            {/* VS Code hides parameter hints behind an open suggest list; they return when it closes. */}
            {signatureHelp.signature && !hideTooltips && !intelliSense.isOpen && (
              <SignatureHelpCard
                signature={signatureHelp.signature}
                position={signatureHelp.position}
              />
            )}

            {intelliSense.isOpen && (
              <SuggestionsDropdown
                id={suggestionsId}
                items={intelliSense.items}
                query={intelliSense.word}
                selectedIndex={intelliSense.selectedIndex}
                position={intelliSense.popupPosition}
                onSelect={(item) => {
                  const cursor = textareaRef.current?.selectionStart;
                  if (cursor === undefined) return;
                  const applied = intelliSense.applySelected(code, cursor, files, filepath, item);
                  if (applied) applyCompletion(applied);
                }}
              />
            )}

            {isHoverVisible && (
              <HoverSignatureCard
                info={hoverSignatures.hoverInfo}
                problems={hoverSignatures.hoverProblems}
                position={hoverSignatures.position}
                onMouseEnter={hoverSignatures.keepHover}
                onMouseLeave={hoverSignatures.handleMouseLeave}
              />
            )}
          </div>
        </div>

        {bottomConsole && <div className={styles.bottomConsoleWrapper}>{bottomConsole}</div>}

        <div className={styles.statusBar}>
          <div className={styles.statusLeft}>
            {formatNotice && (
              <>
                <span className={clsx(styles.statusItem, styles.diagErr)} role="status">
                  {formatNotice}
                </span>
                <span className={styles.statusSep}>|</span>
              </>
            )}
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

            {/* Announced politely: screen readers hear the error count after each check. */}
            <span className={styles.liveRegion} role="status">
              {diagnostics.errorCount > 0 ? (
                <Tooltip
                  content={`${diagnostics.activeDiagnostic?.message ?? ""}\nF8 — следующая проблема`}
                  contentClassName={styles.statusTooltip}
                  side="top"
                >
                  <button
                    type="button"
                    className={clsx(styles.statusItem, styles.statusButton, styles.diagErr)}
                    onClick={() => goToProblem(1)}
                  >
                    <AlertCircle size={11} />
                    <span>{pluralize(diagnostics.errorCount, ERROR_FORMS)}</span>
                  </button>
                </Tooltip>
              ) : (
                <Tooltip content="Синтаксис и типы корректны" side="top">
                  <span className={clsx(styles.statusItem, styles.diagOk)}>
                    <CheckCircle2 size={11} />
                    <span>Синтаксис корректен</span>
                  </span>
                </Tooltip>
              )}
            </span>

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
              {pluralize(lineCount, LINE_FORMS)} ({code.length} симв)
            </span>
          </div>

          <div className={styles.statusRight}>
            <span className={styles.statusItem}>Пробелы: {TAB_SIZE}</span>
            <span className={styles.statusSep}>|</span>
            <span className={styles.statusItem}>UTF-8</span>
            <span className={styles.statusSep}>|</span>
            <Tooltip content={`Язык синтаксиса: ${langInfo.name}`} side="top">
              <span className={styles.statusItem}>
                <Code2 size={11} className={LANGUAGE_ICON_CLASSES[langInfo.id]} />
                <span>{langInfo.name}</span>
              </span>
            </Tooltip>
          </div>
        </div>
      </Tooltip.Provider>
    </div>
  );
};
