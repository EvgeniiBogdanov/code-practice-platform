import React, { memo } from "react";
import {
  Undo2,
  Redo2,
  Wand2,
  WrapText,
  RotateCcw,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  FileCode,
} from "lucide-react";
import { clsx } from "clsx";
import { Tooltip, CodeButton, Switch } from "@/shared/ui";
import { TaskFile } from "@/shared/lib/code-editor";
import { useCopy } from "@/shared/lib/hooks";
import { getFileIconKind, type FileIconKind } from "../../lib/fileIcon";
import styles from "./EditorToolbar.module.css";

export interface EditorToolbarProps {
  files?: TaskFile[];
  activeFileIdx?: number;
  onFileSelect?: (idx: number) => void;
  filepath?: string;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  isLinterEnabled?: boolean;
  onToggleLinter?: (enabled: boolean) => void;
  onFormat?: () => void;
  /** False when the file's language has no formatter; the button is disabled with a reason. */
  canFormat?: boolean;
  wordWrap?: boolean;
  onToggleWordWrap?: () => void;
  onReset?: () => void;
  isModified?: boolean;
  onIncreaseFontSize?: () => void;
  onDecreaseFontSize?: () => void;
  fontSize?: number;
  codeText?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onPreloadFullscreen?: () => void;
  isFullscreenTransitioning?: boolean;
  readOnly?: boolean;
  className?: string;
}

const FILE_ICON_CLASSES: Record<FileIconKind, string> = {
  js: styles.fileIconJs,
  jsx: styles.fileIconJsx,
  ts: styles.fileIconTs,
  tsx: styles.fileIconTsx,
  css: styles.fileIconCss,
  html: styles.fileIconHtml,
  json: styles.fileIconJson,
  other: styles.fileIcon,
};

export const EditorToolbar = memo(
  ({
    files = [],
    activeFileIdx = 0,
    onFileSelect,
    filepath = "main.js",
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    isLinterEnabled,
    onToggleLinter,
    onFormat,
    canFormat = true,
    wordWrap,
    onToggleWordWrap,
    onReset,
    isModified,
    onIncreaseFontSize,
    onDecreaseFontSize,
    fontSize = 13,
    codeText = "",
    isFullscreen,
    onToggleFullscreen,
    onPreloadFullscreen,
    isFullscreenTransitioning = false,
    readOnly = false,
    className,
  }: EditorToolbarProps) => {
    const { copied, copy } = useCopy(codeText);

    return (
      <div className={clsx(styles.toolbar, className)}>
        <div className={styles.left}>
          {files && files.length > 1 ? (
            files.map((file, idx) => {
              const isActive = activeFileIdx === idx;
              const name = file.name || `file-${idx + 1}`;
              return (
                <button
                  key={idx}
                  type="button"
                  className={clsx(styles.fileTab, isActive && styles.active)}
                  onClick={() => onFileSelect && onFileSelect(idx)}
                >
                  <FileCode size={13} className={FILE_ICON_CLASSES[getFileIconKind(name)]} />
                  <span className={styles.fileTabName}>{name}</span>
                </button>
              );
            })
          ) : (
            <div className={styles.singleFile}>
              <FileCode size={13} className={FILE_ICON_CLASSES[getFileIconKind(filepath)]} />
              <span className={styles.fileTabName}>{filepath}</span>
            </div>
          )}
        </div>

        <div className={styles.right}>
          {!readOnly && onUndo && (
            <Tooltip content="Отменить (Ctrl+Z)" side="bottom">
              <CodeButton
                icon={<Undo2 size={14} />}
                onClick={onUndo}
                disabled={!canUndo}
                aria-label="Отменить (Ctrl+Z)"
              />
            </Tooltip>
          )}

          {!readOnly && onRedo && (
            <Tooltip content="Повторить (Ctrl+Y)" side="bottom">
              <CodeButton
                icon={<Redo2 size={14} />}
                onClick={onRedo}
                disabled={!canRedo}
                aria-label="Повторить (Ctrl+Y)"
              />
            </Tooltip>
          )}

          {onToggleLinter && typeof isLinterEnabled === "boolean" && (
            <Tooltip
              content={isLinterEnabled ? "Выключить проверку ошибок" : "Включить проверку ошибок"}
              side="bottom"
            >
              <div className={styles.linterSwitchWrapper}>
                <Switch
                  size="sm"
                  checked={isLinterEnabled}
                  onChange={onToggleLinter}
                  aria-label="Проверка ошибок"
                />
              </div>
            </Tooltip>
          )}

          {onToggleWordWrap && (
            <Tooltip
              content={wordWrap ? "Выключить перенос строк" : "Включить перенос строк (Alt+Z)"}
              side="bottom"
            >
              <CodeButton
                icon={<WrapText size={14} />}
                isActive={wordWrap}
                onClick={onToggleWordWrap}
                aria-label="Перенос строк"
              />
            </Tooltip>
          )}

          {!readOnly && onFormat && (
            <Tooltip
              content={
                canFormat
                  ? "Форматировать код (Shift+Alt+F)"
                  : "Форматирование недоступно для этого типа файла"
              }
              side="bottom"
            >
              <CodeButton
                icon={<Wand2 size={14} />}
                onClick={onFormat}
                disabled={!canFormat}
                aria-label="Форматировать код (Prettier)"
              />
            </Tooltip>
          )}

          {!readOnly && onReset && (isModified || isModified === undefined) && (
            <Tooltip content="Сбросить код к исходному шаблону" side="bottom">
              <CodeButton
                icon={<RotateCcw size={14} />}
                onClick={onReset}
                aria-label="Сбросить код"
              />
            </Tooltip>
          )}

          <Tooltip
            content={copied ? "Скопировано в буфер!" : "Скопировать код решения"}
            side="bottom"
          >
            <CodeButton
              icon={
                copied ? <Check size={14} className={styles.copiedCheck} /> : <Copy size={14} />
              }
              onClick={() => copy()}
              aria-label="Скопировать код"
            />
          </Tooltip>

          {onDecreaseFontSize && (
            <Tooltip content={`Уменьшить шрифт (${fontSize}px, Ctrl -)`} side="bottom">
              <CodeButton
                icon={<ZoomOut size={14} />}
                onClick={onDecreaseFontSize}
                disabled={fontSize <= 12}
                aria-label="Уменьшить шрифт"
              />
            </Tooltip>
          )}

          <span className={styles.fontSizeLabel}>{fontSize}px</span>

          {onIncreaseFontSize && (
            <Tooltip content={`Увеличить шрифт (${fontSize}px, Ctrl +)`} side="bottom">
              <CodeButton
                icon={<ZoomIn size={14} />}
                onClick={onIncreaseFontSize}
                disabled={fontSize >= 24}
                aria-label="Увеличить шрифт"
              />
            </Tooltip>
          )}

          {onToggleFullscreen && (
            <Tooltip
              content={isFullscreen ? "Свернуть редактор (Esc)" : "Развернуть редактор (F11)"}
              side="bottom"
            >
              <CodeButton
                icon={isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                onClick={onToggleFullscreen}
                onPointerEnter={onPreloadFullscreen}
                onFocus={onPreloadFullscreen}
                disabled={isFullscreenTransitioning}
                aria-label={isFullscreen ? "Свернуть редактор" : "Развернуть редактор"}
              />
            </Tooltip>
          )}
        </div>
      </div>
    );
  }
);

EditorToolbar.displayName = "EditorToolbar";
