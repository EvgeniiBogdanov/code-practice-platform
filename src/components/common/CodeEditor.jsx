import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  RotateCcw,
  Copy,
  Check,
  FileCode,
  Maximize2,
  Minimize2,
  WrapText,
  Undo2,
  Redo2,
  CheckCircle2,
  Code2,
  AlertCircle,
  Wand2,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Box,
  Globe,
} from "lucide-react";
import { highlightJS } from "../../utils/codeHighlighter";
import { checkAutoCloseTag, getCompletions, expandSnippet } from "../../utils/snippetsEngine";
import { lintJavaScriptCode, fixTypoInCode } from "../../utils/codeLinter";
import { formatJavaScriptCode } from "../../utils/codeFormatter";

const MIN_FONT_SIZE = 13;
const MAX_FONT_SIZE = 20;
const FONT_SIZE_STORAGE_KEY = "playground_editor_font_size";

export const CodeEditor = ({
  initialCode = "",
  taskId = "default",
  filepath = "main.js",
  onRun,
  onChange,
  readOnly = false,
  title = "main.js",
  files = [],
  activeFileIdx = 0,
  onFileSelect,
  bottomConsole = null,
}) => {
  const storageKey = `playground_js_code_${taskId}`;

  // Восстановление кода из localStorage
  const [code, setCode] = useState(() => {
    if (readOnly) return initialCode;
    try {
      const saved = localStorage.getItem(storageKey);
      return saved !== null ? saved : initialCode;
    } catch {
      return initialCode;
    }
  });

  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.key === "F11") {
        e.preventDefault();
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);
  const [wordWrap, setWordWrap] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1, selectedLength: 0 });

  // Размер шрифта редактора (мин 13px, макс 20px, по умолчанию 13px, сохранение в localStorage)
  const [fontSize, setFontSize] = useState(() => {
    try {
      const saved = localStorage.getItem(FONT_SIZE_STORAGE_KEY);
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= MIN_FONT_SIZE && parsed <= MAX_FONT_SIZE) {
          return parsed;
        }
      }
    } catch (err) {
      console.error("Failed to load font size from localStorage", err);
    }
    return MIN_FONT_SIZE;
  });

  const handleIncreaseFontSize = () => {
    setFontSize((prev) => {
      const next = Math.min(MAX_FONT_SIZE, prev + 1);
      try {
        localStorage.setItem(FONT_SIZE_STORAGE_KEY, String(next));
      } catch (err) {
        console.error("Failed to save font size to localStorage", err);
      }
      return next;
    });
  };

  const handleDecreaseFontSize = () => {
    setFontSize((prev) => {
      const next = Math.max(MIN_FONT_SIZE, prev - 1);
      try {
        localStorage.setItem(FONT_SIZE_STORAGE_KEY, String(next));
      } catch (err) {
        console.error("Failed to save font size to localStorage", err);
      }
      return next;
    });
  };

  // Автоматическая проверка синтаксиса и опечаток (conts -> const, etc.)
  const [diagnostics, setDiagnostics] = useState({
    problems: [],
    errorCount: 0,
    warningCount: 0,
    isValid: true,
    typoMap: {},
  });

  // Состояние меню автодополнения (IntelliSense Popover)
  const [completionState, setCompletionState] = useState({
    visible: false,
    word: "",
    items: [],
    selectedIndex: 0,
  });

  const checkAndTriggerCompletions = (currentCode, cursorIdx) => {
    if (readOnly) return;
    const { word, items } = getCompletions(currentCode, cursorIdx);
    if (items.length > 0 && word.length >= 1) {
      setCompletionState((prev) => ({
        visible: true,
        word,
        items,
        selectedIndex: prev.visible && prev.word === word ? Math.min(prev.selectedIndex, items.length - 1) : 0,
      }));
    } else {
      setCompletionState({ visible: false, word: "", items: [], selectedIndex: 0 });
    }
  };

  const handleApplyCompletion = (item) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const cursorIndex = textarea.selectionStart;
    const word = completionState.word;

    if (item.kind === "snippet" && item.snippet) {
      const { newCode, newCursorPos } = expandSnippet(code, cursorIndex, item.snippet, word);
      updateCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newCursorPos;
          textareaRef.current.focus();
        }
      }, 0);
    } else {
      const startReplace = Math.max(0, cursorIndex - word.length);
      const before = code.substring(0, startReplace);
      const after = code.substring(cursorIndex);
      const insertText = item.insertText;
      const newCode = before + insertText + after;
      const newCursorPos = startReplace + insertText.length;
      updateCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newCursorPos;
          textareaRef.current.focus();
        }
      }, 0);
    }
    setCompletionState({ visible: false, word: "", items: [], selectedIndex: 0 });
  };

  const calculatePopoverPos = () => {
    const textarea = textareaRef.current;
    if (!textarea) return { top: 32, left: 50 };
    const pos = textarea.selectionStart;
    const textBefore = code.substring(0, pos);
    const lineNum = textBefore.split("\n").length;
    const colNum = pos - textBefore.lastIndexOf("\n");

    const lineH = Math.round(fontSize * 1.5);
    const charW = Math.round(fontSize * 0.58);

    const top = lineNum * lineH + 6;
    const left = Math.min(Math.max(colNum * charW + 42, 45), 450);

    return { top, left };
  };

  // Стек истории для Undo/Redo
  const historyRef = useRef([initialCode]);
  const historyIndexRef = useRef(0);

  const textareaRef = useRef(null);
  const highlightRef = useRef(null);
  const gutterRef = useRef(null);

  // Живая проверка синтаксиса при изменении кода
  useEffect(() => {
    const result = lintJavaScriptCode(code);
    setDiagnostics(result);
  }, [code]);

  // Смена задачи
  useEffect(() => {
    if (readOnly) {
      setCode(initialCode);
      historyRef.current = [initialCode];
      historyIndexRef.current = 0;
      if (onChange) onChange(initialCode);
      return;
    }
    try {
      const saved = localStorage.getItem(storageKey);
      const active = saved !== null ? saved : initialCode;
      setCode(active);
      historyRef.current = [active];
      historyIndexRef.current = 0;
      if (onChange) onChange(active);
    } catch {
      setCode(initialCode);
      if (onChange) onChange(initialCode);
    }
  }, [taskId, initialCode, readOnly]);

  const pushHistory = (newCode) => {
    const nextHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    if (nextHistory[nextHistory.length - 1] !== newCode) {
      nextHistory.push(newCode);
      if (nextHistory.length > 50) nextHistory.shift();
      historyRef.current = nextHistory;
      historyIndexRef.current = nextHistory.length - 1;
    }
  };

  const updateCode = (newCode, addToHistory = true) => {
    setCode(newCode);
    if (addToHistory) pushHistory(newCode);
    if (onChange) onChange(newCode);
    if (!readOnly && taskId) {
      try {
        localStorage.setItem(storageKey, newCode);
      } catch (err) {
        console.error("Failed to save code", err);
      }
    }
  };

  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const prev = historyRef.current[historyIndexRef.current];
      setCode(prev);
      if (onChange) onChange(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      const next = historyRef.current[historyIndexRef.current];
      setCode(next);
      if (onChange) onChange(next);
    }
  };

  const handleFormat = async () => {
    if (!code) return;
    try {
      const formatted = await formatJavaScriptCode(code);
      if (formatted && formatted !== code) {
        updateCode(formatted);
      }
    } catch (err) {
      console.error("Failed to format code with Prettier", err);
    }
  };

  const handleReset = () => {
    updateCode(initialCode);
    if (taskId) {
      try {
        localStorage.removeItem(storageKey);
      } catch (err) {
        console.error("Failed to reset code", err);
      }
    }
  };

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Быстрое автоматическое исправление опечатки (conts -> const)
  const handleFixTypo = (typoObj) => {
    if (!typoObj) return;
    const fixed = fixTypoInCode(code, typoObj.line, typoObj.typo, typoObj.correct);
    updateCode(fixed);
    if (textareaRef.current) {
      textareaRef.current.value = fixed;
      textareaRef.current.focus();
    }
  };

  const updateCursorCoordinates = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const pos = textarea.selectionStart;
    const textBefore = code.substring(0, pos);
    const line = textBefore.split("\n").length;
    const col = pos - textBefore.lastIndexOf("\n");
    const selectedLength = Math.abs(textarea.selectionEnd - textarea.selectionStart);
    setCursorPos({ line, col, selectedLength });
  };

  // Обработка клавиш: Enter, Tab, скобки, комментарии
  const handleKeyDown = (e) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // 0. Навигация в меню автодополнения (ArrowUp, ArrowDown, Enter, Tab, Escape)
    if (completionState.visible && completionState.items.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCompletionState((prev) => ({
          ...prev,
          selectedIndex: (prev.selectedIndex + 1) % prev.items.length,
        }));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setCompletionState((prev) => ({
          ...prev,
          selectedIndex: (prev.selectedIndex - 1 + prev.items.length) % prev.items.length,
        }));
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        const selectedItem = completionState.items[completionState.selectedIndex];
        if (selectedItem) {
          handleApplyCompletion(selectedItem);
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setCompletionState({ visible: false, word: "", items: [], selectedIndex: 0 });
        return;
      }
    }

    // 1. Горячие клавиши запуска: Ctrl+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (onRun) onRun(code);
      return;
    }

    // 1.1. Форматирование кода через Prettier: Shift+Alt+F или Ctrl+Alt+L
    if ((e.shiftKey && e.altKey && e.key.toLowerCase() === "f") || ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === "l")) {
      e.preventDefault();
      handleFormat();
      return;
    }

    // Изменение размера шрифта: Ctrl+ / Ctrl-
    if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "=")) {
      e.preventDefault();
      handleIncreaseFontSize();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && (e.key === "-" || e.key === "_")) {
      e.preventDefault();
      handleDecreaseFontSize();
      return;
    }

    // 2. Undo / Redo (Ctrl+Z / Ctrl+Y)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      if (e.shiftKey) handleRedo();
      else handleUndo();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
      e.preventDefault();
      handleRedo();
      return;
    }

    // 3. Комментирование строки: Ctrl+/ или Cmd+/
    if ((e.ctrlKey || e.metaKey) && (e.key === "/" || e.key === ".")) {
      e.preventDefault();
      const lines = code.split("\n");
      const textBefore = code.substring(0, start);
      const curLineIdx = textBefore.split("\n").length - 1;

      if (start === end) {
        const targetLine = lines[curLineIdx];
        if (targetLine.trim().startsWith("//")) {
          lines[curLineIdx] = targetLine.replace(/\/\/\s?/, "");
        } else {
          lines[curLineIdx] = "// " + targetLine;
        }
      } else {
        const textEnd = code.substring(0, end);
        const endLineIdx = textEnd.split("\n").length - 1;
        const allCommented = lines.slice(curLineIdx, endLineIdx + 1).every((l) => l.trim().startsWith("//") || !l.trim());

        for (let i = curLineIdx; i <= endLineIdx; i++) {
          if (allCommented) {
            lines[i] = lines[i].replace(/\/\/\s?/, "");
          } else {
            lines[i] = "// " + lines[i];
          }
        }
      }

      const updated = lines.join("\n");
      updateCode(updated);
      return;
    }

    // 4. Автозакрытие HTML / JSX тегов при нажатии '>'
    if (e.key === ">" && start === end) {
      const textBefore = code.substring(0, start);
      const autoCloseTag = checkAutoCloseTag(textBefore);

      if (autoCloseTag) {
        e.preventDefault();
        const closeTagStr = `></${autoCloseTag}>`;
        const updated = code.substring(0, start) + closeTagStr + code.substring(end);
        updateCode(updated);

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }, 0);
        return;
      }
    }

    // 5. Автозакрытие скобок и кавычек
    const pairMap = {
      "(": ")",
      "{": "}",
      "[": "]",
      '"': '"',
      "'": "'",
      "`": "`",
    };

    if (pairMap[e.key]) {
      const nextChar = code.charAt(start);
      if (nextChar === e.key && ["'", '"', "`", ")", "}", "]"].includes(e.key) && start === end) {
        e.preventDefault();
        textarea.selectionStart = textarea.selectionEnd = start + 1;
        return;
      }

      e.preventDefault();
      const open = e.key;
      const close = pairMap[open];
      const selected = code.substring(start, end);
      const updated = code.substring(0, start) + open + selected + close + code.substring(end);
      updateCode(updated);

      setTimeout(() => {
        textarea.selectionStart = start + 1;
        textarea.selectionEnd = start + 1 + selected.length;
      }, 0);
      return;
    }

    // 6. Умный Backspace для пар скобок
    if (e.key === "Backspace" && start === end && start > 0) {
      const prevChar = code.charAt(start - 1);
      const nextChar = code.charAt(start);
      if (
        (prevChar === "(" && nextChar === ")") ||
        (prevChar === "{" && nextChar === "}") ||
        (prevChar === "[" && nextChar === "]") ||
        (prevChar === '"' && nextChar === '"') ||
        (prevChar === "'" && nextChar === "'") ||
        (prevChar === "`" && nextChar === "`")
      ) {
        e.preventDefault();
        const updated = code.substring(0, start - 1) + code.substring(start + 1);
        updateCode(updated);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start - 1;
        }, 0);
        return;
      }
    }

    // 7. Умный Enter с расчетом отступа
    if (e.key === "Enter") {
      const prevChar = code.charAt(start - 1);
      const nextChar = code.charAt(start);
      const textBefore = code.substring(0, start);
      const lastLine = textBefore.substring(textBefore.lastIndexOf("\n") + 1);
      const currentIndent = lastLine.match(/^\s*/)[0];

      if (prevChar === "{" && nextChar === "}") {
        e.preventDefault();
        const extraIndent = currentIndent + "  ";
        const updated =
          code.substring(0, start) + "\n" + extraIndent + "\n" + currentIndent + code.substring(end);
        updateCode(updated);

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1 + extraIndent.length;
        }, 0);
        return;
      }

      if (prevChar === "{" || prevChar === "(" || prevChar === "[" || prevChar === ":") {
        e.preventDefault();
        const extraIndent = currentIndent + "  ";
        const updated = code.substring(0, start) + "\n" + extraIndent + code.substring(end);
        updateCode(updated);

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1 + extraIndent.length;
        }, 0);
        return;
      }

      if (currentIndent.length > 0) {
        e.preventDefault();
        const updated = code.substring(0, start) + "\n" + currentIndent + code.substring(end);
        updateCode(updated);

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1 + currentIndent.length;
        }, 0);
        return;
      }
    }

    // 8. Tab / Shift+Tab (Отступ 2 пробела / Обратный отступ)
    if (e.key === "Tab") {
      e.preventDefault();
      const spaces = "  ";

      if (start === end) {
        if (e.shiftKey) {
          const lineStart = code.lastIndexOf("\n", start - 1) + 1;
          if (code.startsWith("  ", lineStart)) {
            const updated = code.substring(0, lineStart) + code.substring(lineStart + 2);
            updateCode(updated);
            setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = Math.max(lineStart, start - 2);
            }, 0);
          }
        } else {
          const updated = code.substring(0, start) + spaces + code.substring(end);
          updateCode(updated);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
          }, 0);
        }
      } else {
        const lineStart = code.lastIndexOf("\n", start - 1) + 1;
        const lineEnd = code.indexOf("\n", end);
        const effectiveEnd = lineEnd === -1 ? code.length : lineEnd;
        const block = code.substring(lineStart, effectiveEnd);
        const lines = block.split("\n");

        let updatedLines;
        if (e.shiftKey) {
          updatedLines = lines.map((l) => (l.startsWith("  ") ? l.substring(2) : l.startsWith(" ") ? l.substring(1) : l));
        } else {
          updatedLines = lines.map((l) => spaces + l);
        }

        const updated = code.substring(0, lineStart) + updatedLines.join("\n") + code.substring(effectiveEnd);
        updateCode(updated);
      }
    }
  };

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

  const lines = (code || "").split("\n");
  const langInfo = useMemo(() => {
    const cleanPath = (filepath || title || "").toLowerCase();
    const fileExt = cleanPath.split(".").pop();

    if (fileExt === "tsx") {
      return { name: "React TSX", color: "#61dafb" };
    }
    if (fileExt === "jsx") {
      return { name: "React JSX", color: "#61dafb" };
    }
    if (fileExt === "ts") {
      return { name: "TypeScript", color: "#3178c6" };
    }

    const isReactCode =
      /<[a-zA-Z0-9_]+(\s+[^>]*|\s*\/)?>|<\/[a-zA-Z0-9_]+>|<>/m.test(code) ||
      /import\s+.*React|from\s+['"]react['"]|export\s+default\s+function/m.test(code);

    if (cleanPath.includes("react") || isReactCode) {
      return { name: "React JSX", color: "#61dafb" };
    }

    return { name: "JavaScript", color: "#f59e0b" };
  }, [filepath, title, code]);

  const lineCount = lines.length;
  const isCodeModified = !readOnly && code !== initialCode;
  const activeLine = cursorPos.line;

  const cleanFilename = title || filepath.split("/").pop() || "main.js";

  // Текущая опечатка на активной строке курсора или первая в коде
  const activeTypo = diagnostics.typoMap[activeLine] || Object.values(diagnostics.typoMap)[0];

  return (
    <div
      className={`vscode-ide-editor ${isFullscreen ? "ide-fullscreen" : ""} ${
        isFocused ? "ide-focused" : ""
      }`}
      style={{ "--editor-font-size": `${fontSize}px` }}
    >
      {/* Шапка редактора: Слева вкладки файлов (с горизонтальным скроллом), Справа кнопки управления */}
      <div className="vscode-editor-header">
        {files && files.length > 0 ? (
          <div className="vscode-editor-tabs-container">
            {files.map((file, idx) => {
              const isActive = activeFileIdx === idx;
              const ext = file.name.split(".").pop().toLowerCase();
              const isReact = ext === "jsx" || ext === "tsx";
              const isTs = ext === "ts";

              return (
                <button
                  key={idx}
                  className={`vscode-file-tab ${isActive ? "active" : ""}`}
                  onClick={() => onFileSelect && onFileSelect(idx)}
                >
                  <FileCode
                    size={13}
                    style={{
                      color: isReact ? "#61dafb" : isTs ? "#3178c6" : "#f59e0b",
                      flexShrink: 0,
                    }}
                  />
                  <span className="file-tab-name">{file.name}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="vscode-editor-single-file">
            <FileCode
              size={13}
              style={{
                color:
                  cleanFilename.endsWith("jsx") || cleanFilename.endsWith("tsx")
                    ? "#61dafb"
                    : cleanFilename.endsWith("ts")
                    ? "#3178c6"
                    : "#f59e0b",
                flexShrink: 0,
              }}
            />
            <span className="file-tab-name">{cleanFilename}</span>
          </div>
        )}

        <div className="vscode-editor-actions">
          {!readOnly && (
            <>
              <button
                className="vscode-icon-btn"
                onClick={handleUndo}
                disabled={historyIndexRef.current <= 0}
                data-tooltip="Отменить изменение (Ctrl+Z)"
              >
                <Undo2 size={14} />
              </button>
              <button
                className="vscode-icon-btn"
                onClick={handleRedo}
                disabled={historyIndexRef.current >= historyRef.current.length - 1}
                data-tooltip="Повторить изменение (Ctrl+Y)"
              >
                <Redo2 size={14} />
              </button>
              <button
                className="vscode-icon-btn"
                onClick={handleFormat}
                data-tooltip="Отформатировать код (Prettier, Shift+Alt+F)"
              >
                <Wand2 size={14} />
              </button>
            </>
          )}

          <button
            className={`vscode-icon-btn ${wordWrap ? "active" : ""}`}
            onClick={() => setWordWrap((prev) => !prev)}
            data-tooltip={wordWrap ? "Выключить перенос длинных строк" : "Включить перенос длинных строк"}
          >
            <WrapText size={14} />
          </button>

          {isCodeModified && (
            <button
              className="vscode-icon-btn"
              onClick={handleReset}
              data-tooltip="Сбросить код к исходному шаблону"
            >
              <RotateCcw size={14} />
            </button>
          )}

          {/* Кнопка копирования: только иконка */}
          <button
            className="vscode-icon-btn"
            onClick={handleCopy}
            data-tooltip={copied ? "Скопировано в буфер обмена" : "Скопировать код решения"}
          >
            {copied ? (
              <Check size={14} style={{ color: "#10b981" }} />
            ) : (
              <Copy size={14} />
            )}
          </button>

          <button
            className="vscode-icon-btn"
            onClick={handleDecreaseFontSize}
            disabled={fontSize <= MIN_FONT_SIZE}
            data-tooltip={
              fontSize <= MIN_FONT_SIZE
                ? `Минимальный размер шрифта (${MIN_FONT_SIZE}px)`
                : `Уменьшить шрифт кода (${fontSize}px, Ctrl -)`
            }
          >
            <ZoomOut size={14} />
          </button>
          <button
            className="vscode-icon-btn"
            onClick={handleIncreaseFontSize}
            disabled={fontSize >= MAX_FONT_SIZE}
            data-tooltip={
              fontSize >= MAX_FONT_SIZE
                ? `Максимальный размер шрифта (${MAX_FONT_SIZE}px)`
                : `Увеличить шрифт кода (${fontSize}px, Ctrl +)`
            }
          >
            <ZoomIn size={14} />
          </button>

          <button
            className="vscode-icon-btn"
            onClick={() => setIsFullscreen((prev) => !prev)}
            data-tooltip={isFullscreen ? "Выйти из полноэкранного режима (F11)" : "Развернуть на весь экран (F11)"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Ненавязчивая плашка быстрого автоисправления опечаток (conts -> const) */}
      {activeTypo && (
        <div className="typo-quickfix-banner">
          <div className="typo-banner-left">
            <AlertCircle size={13} style={{ color: "#f87171" }} />
            <span className="typo-msg">
              Стр {activeTypo.line}: Опечатка <code>{activeTypo.typo}</code> вместо <strong>{activeTypo.correct}</strong>
            </span>
          </div>
          <button
            className="typo-fix-btn"
            onClick={() => handleFixTypo(activeTypo)}
            title={`Заменить '${activeTypo.typo}' на '${activeTypo.correct}'`}
          >
            <Wand2 size={12} />
            <span>Исправить на {activeTypo.correct}</span>
          </button>
        </div>
      )}

      {/* Рабочая область редактора */}
      <div className={`vscode-editor-surface ${wordWrap ? "wrap-on" : "wrap-off"}`}>
        {/* Номера строк с индикатором ошибок */}
        <div ref={gutterRef} className="vscode-gutter" aria-hidden="true">
          {Array.from({ length: Math.max(lineCount, 1) }).map((_, i) => {
            const lineNum = i + 1;
            const hasError = diagnostics.problems.some((p) => p.line === lineNum && p.severity === "error");

            return (
              <div
                key={i}
                className={`vscode-gutter-line ${activeLine === lineNum ? "active-line-gutter" : ""} ${
                  hasError ? "gutter-has-error" : ""
                }`}
                title={hasError ? "Ошибка синтаксиса или опечатка на строке" : ""}
              >
                {hasError && <span className="gutter-error-dot">•</span>}
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Холст кода */}
        <div className="vscode-canvas">
          {readOnly ? (
            <pre className="vscode-pre-only">
              <code
                dangerouslySetInnerHTML={{
                  __html: highlightJS(code || "// Код подготавливается"),
                }}
              />
            </pre>
          ) : (
            <div className="vscode-code-stack">
              {/* Слой подсветки синтаксиса */}
              <pre ref={highlightRef} className="vscode-syntax-layer" aria-hidden="true">
                <code
                  dangerouslySetInnerHTML={{
                    __html: highlightJS(code + "\n"),
                  }}
                />
              </pre>

              {/* Слой ввода */}
              <textarea
                ref={textareaRef}
                className="vscode-input-textarea"
                value={code}
                onChange={(e) => {
                  const val = e.target.value;
                  const pos = e.target.selectionStart;
                  updateCode(val);
                  updateCursorCoordinates();
                  checkAndTriggerCompletions(val, pos);
                }}
                onKeyDown={handleKeyDown}
                onKeyUp={(e) => {
                  updateCursorCoordinates();
                  if (!["ArrowUp", "ArrowDown", "Enter", "Tab", "Escape"].includes(e.key) && textareaRef.current) {
                    checkAndTriggerCompletions(code, textareaRef.current.selectionStart);
                  }
                }}
                onClick={() => {
                  updateCursorCoordinates();
                  if (textareaRef.current) {
                    checkAndTriggerCompletions(code, textareaRef.current.selectionStart);
                  }
                }}
                onSelect={() => {
                  updateCursorCoordinates();
                }}
                onFocus={() => {
                  setIsFocused(true);
                  updateCursorCoordinates();
                  if (textareaRef.current) {
                    checkAndTriggerCompletions(code, textareaRef.current.selectionStart);
                  }
                }}
                onBlur={() => {
                  setIsFocused(false);
                  setTimeout(() => {
                    setCompletionState({ visible: false, word: "", items: [], selectedIndex: 0 });
                  }, 200);
                }}
                onScroll={handleScroll}
                placeholder="// Напишите ваш код решения здесь..."
                spellCheck="false"
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
              />

              {/* Всплывающее меню подсказок и автодополнения (IntelliSense) */}
              {completionState.visible && completionState.items.length > 0 && (
                <div
                  className="autocomplete-popover"
                  style={{
                    top: `${calculatePopoverPos().top}px`,
                    left: `${calculatePopoverPos().left}px`,
                  }}
                >
                  <div className="autocomplete-header">
                    <span>Подсказки для "{completionState.word}"</span>
                    <span className="autocomplete-hint">↑↓ выбор • Enter/Tab вставить</span>
                  </div>
                  <div className="autocomplete-list">
                    {completionState.items.map((item, idx) => {
                      const isSelected = idx === completionState.selectedIndex;
                      return (
                        <div
                          key={idx}
                          className={`autocomplete-item ${isSelected ? "autocomplete-active" : ""}`}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleApplyCompletion(item);
                          }}
                          onMouseEnter={() => {
                            setCompletionState((prev) => ({ ...prev, selectedIndex: idx }));
                          }}
                        >
                          <span className={`autocomplete-kind-badge kind-${item.kind}`}>
                            {item.kind === "snippet" ? (
                              <Wand2 size={12} />
                            ) : item.kind === "hook" ? (
                              <Sparkles size={12} />
                            ) : item.kind === "keyword" ? (
                              <Code2 size={12} />
                            ) : item.kind === "variable" ? (
                              <Box size={12} />
                            ) : (
                              <Globe size={12} />
                            )}
                          </span>
                          <span className="autocomplete-label">{item.label}</span>
                          <span className="autocomplete-detail">{item.detail}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Минималистичный статус-бар с проверкой орфографии */}
      {!bottomConsole && (
        <div className="vscode-status-bar">
          <div className="status-left">
            {diagnostics.errorCount > 0 ? (
              <span className="status-item status-typo-warning" title="Обнаружена синтаксическая опечатка">
                <AlertCircle size={11} style={{ color: "#f87171" }} />
                <span>
                  {diagnostics.errorCount} {diagnostics.errorCount === 1 ? "ошибка" : "ошибок"}
                  {activeTypo && `: ${activeTypo.typo} → ${activeTypo.correct}`}
                </span>
              </span>
            ) : (
              <span className="status-item status-typo-ok">
                <CheckCircle2 size={11} style={{ color: "#34d399" }} />
                <span>Синтаксис корректен</span>
              </span>
            )}

            <span className="status-sep">|</span>

            <span className="status-item status-coords">
              Стр {cursorPos.line}, Кол {cursorPos.col}
            </span>
            <span className="status-sep">|</span>
            <span className="status-item">
              {lineCount} {lineCount === 1 ? "строка" : lineCount < 5 ? "строки" : "строк"} ({code.length} симв)
            </span>
          </div>

          <div className="status-right">
            <span className="status-item">Пробелы: 2</span>
            <span className="status-sep">|</span>
            <span className="status-item">UTF-8</span>
            <span className="status-sep">|</span>
            <span className="status-item lang-tag" title={`Язык синтаксиса: ${langInfo.name}`}>
              <Code2 size={11} style={{ color: langInfo.color }} /> {langInfo.name}
            </span>
          </div>
        </div>
      )}

      {bottomConsole && (
        <div className="vscode-editor-bottom-console">
          {bottomConsole}
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
