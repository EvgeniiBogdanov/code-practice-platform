import React, { memo, useState } from "react";
import {
  Undo2,
  Redo2,
  Wand2,
  WrapText,
  Search,
  RotateCcw,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  FileCode,
} from "lucide-react";
import { Tooltip, CodeButton } from "@/shared/ui";
import { TaskFile } from "@/shared/lib/code-editor";
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
  onFormat?: () => void;
  wordWrap?: boolean;
  onToggleWordWrap?: () => void;
  isFindOpen?: boolean;
  onToggleFind?: () => void;
  onReset?: () => void;
  isModified?: boolean;
  onIncreaseFontSize?: () => void;
  onDecreaseFontSize?: () => void;
  fontSize?: number;
  codeText?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  readOnly?: boolean;
  className?: string;
}

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
    onFormat,
    wordWrap,
    onToggleWordWrap,
    isFindOpen,
    onToggleFind,
    onReset,
    isModified,
    onIncreaseFontSize,
    onDecreaseFontSize,
    fontSize = 13,
    codeText = "",
    isFullscreen,
    onToggleFullscreen,
    readOnly = false,
    className,
  }: EditorToolbarProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      if (!codeText) return;
      try {
        await navigator.clipboard.writeText(codeText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // ignore
      }
    };

    const getFileIconClass = (filename: string) => {
      const ext = filename.split(".").pop()?.toLowerCase();
      if (ext === "jsx" || ext === "tsx") return styles.fileIconReact;
      if (ext === "ts") return styles.fileIconTs;
      return styles.fileIconJs;
    };

    return (
      <div className={[styles.toolbar, className].filter(Boolean).join(" ")}>
        <div className={styles.left}>
          {files && files.length > 1 ? (
            files.map((file, idx) => {
              const isActive = activeFileIdx === idx;
              const name = file.name || `file-${idx + 1}`;
              return (
                <button
                  key={idx}
                  type="button"
                  className={[styles.fileTab, isActive && styles.active].filter(Boolean).join(" ")}
                  onClick={() => onFileSelect && onFileSelect(idx)}
                >
                  <FileCode size={13} className={getFileIconClass(name)} />
                  <span className={styles.fileTabName}>{name}</span>
                </button>
              );
            })
          ) : (
            <div className={styles.singleFile}>
              <FileCode size={13} className={getFileIconClass(filepath)} />
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

          {!readOnly && onFormat && (
            <Tooltip content="Форматировать код (Shift+Alt+F)" side="bottom">
              <CodeButton
                icon={<Wand2 size={14} />}
                onClick={onFormat}
                aria-label="Форматировать код (Prettier)"
              />
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

          {onToggleFind && (
            <Tooltip content="Поиск и замена (Ctrl+F)" side="bottom">
              <CodeButton
                icon={<Search size={14} />}
                isActive={isFindOpen}
                onClick={onToggleFind}
                aria-label="Поиск и замена в файле (Ctrl+F)"
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
              onClick={handleCopy}
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
