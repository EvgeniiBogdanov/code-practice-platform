import React, { useId, useMemo } from "react";
import { clsx } from "clsx";
import { Tooltip } from "@/shared/ui";
import { canFormat } from "@/shared/lib/code-editor";
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
import { HighlightedCode } from "../HighlightedCode";
import { EditorStatusBar } from "../EditorStatusBar";
import styles from "./CodeEditor.module.css";

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
  const suggestionsId = useId();
  const {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    wrapperRef,
    textareaRef,
    highlightRef,
    linesRef,
    gutterRef,
    wordWrap,
    toggleWordWrap,
    hideTooltips,
    effectiveFullscreen,
    toggleFullscreen,
    cursorPos,
    history,
    intelliSense,
    hoverSignatures,
    signatureHelp,
    multiCursor,
    find,
    occurrences,
    diagnostics,
    firstQuickFixRef,
    applyQuickFix,
    goToNextProblem,
    isAnalysisPending,
    highlightedLines,
    lineCount,
    lineHeights,
    bracketPair,
    secondaryCarets,
    isScrolling,
    isLinterEnabled,
    handleToggleLinter,
    handleFormat,
    formatNotice,
    applyCompletion,
    undo,
    redo,
    getCode,
    handleScroll,
    handleTextChange,
    handlePaste,
    handleTextareaClick,
    handleTextareaBlur,
    handleCursorKeyUp,
    handleOverlayKeyDown,
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
    onFilesChange,
  });

  // Tabs only show names: typing in a file must not hand the toolbar a new array.
  const fileNamesKey = files.map((file) => file.name ?? "").join("\n");
  const fileNames = useMemo(() => (fileNamesKey ? fileNamesKey.split("\n") : []), [fileNamesKey]);

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
      onKeyDown={handleOverlayKeyDown}
    >
      <Tooltip.Provider delayDuration={600} skipDelayDuration={300}>
        <EditorToolbar
          fileNames={fileNames}
          activeFileIdx={activeFileIdx}
          onFileSelect={onFileSelect}
          filepath={filepath}
          canUndo={history.canUndo}
          canRedo={history.canRedo}
          onUndo={undo}
          onRedo={redo}
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
          getCodeText={getCode}
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
              <TextMarkLayer code={code} variant="occurrence" marks={occurrences} />
              <TextMarkLayer code={code} variant="selection" marks={multiCursor.selections} />
              <HighlightedCode lines={highlightedLines} codeRef={linesRef} />
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
              onKeyDown={handleKeyDown}
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

        <EditorStatusBar
          code={code}
          filepath={filepath}
          lineCount={lineCount}
          cursorLine={cursorPos.line}
          cursorCol={cursorPos.col}
          errorCount={diagnostics.errorCount}
          problemMessage={diagnostics.activeDiagnostic?.message}
          onGoToProblem={goToNextProblem}
          multiCursorCount={multiCursor.hasMultipleCursors ? multiCursor.selections.length : 0}
          formatNotice={formatNotice}
        />
      </Tooltip.Provider>
    </div>
  );
};
