import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
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
import {
  getCompletions,
  expandSnippet,
  expandImportStatement,
  addImportToFile,
} from "../../utils/snippetsEngine";
import {
  checkAutoCloseTag,
  findLastUnclosedTag,
  handleAutoRenameTag,
} from "../../utils/tagEngine";
import { lintJavaScriptCode, fixTypoInCode } from "../../utils/codeLinter";
import { formatJavaScriptCode } from "../../utils/codeFormatter";
import { useUIStore } from "../../stores/useUIStore";
import {
  getSolution,
  saveSolutionDebounced,
  deleteSolution,
  peekCachedSolution,
  flushPendingSaves,
  subscribeToSyncEvents,
} from "../../services/storage";

const MIN_FONT_SIZE = 14;
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
  isFullscreen: externalIsFullscreen,
  onToggleFullscreen,
  extraHeaderActions = null,
}) => {
  // Восстановление кода из IndexedDB / L1-кэша памяти
  const [code, setCode] = useState(() => {
    if (readOnly) return initialCode;
    const cached = peekCachedSolution(taskId);
    return cached !== null ? cached : initialCode;
  });

  const [copied, setCopied] = useState(false);
  const [internalIsFullscreen, setInternalIsFullscreen] = useState(false);
  const isFullscreen =
    externalIsFullscreen !== undefined
      ? externalIsFullscreen
      : internalIsFullscreen;

  const handleToggleFullscreen = () => {
    if (onToggleFullscreen) {
      onToggleFullscreen();
    } else {
      setInternalIsFullscreen((prev) => !prev);
    }
  };

  useEffect(() => {
    if (!isFullscreen || onToggleFullscreen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.key === "F11") {
        e.preventDefault();
        setInternalIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, onToggleFullscreen]);
  const [wordWrap, setWordWrap] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [cursorPos, setCursorPos] = useState({
    line: 1,
    col: 1,
    selectedLength: 0,
  });

  const fontSize = useUIStore((state) => state.editorFontSize);
  const handleIncreaseFontSize = useUIStore(
    (state) => state.increaseEditorFontSize,
  );
  const handleDecreaseFontSize = useUIStore(
    (state) => state.decreaseEditorFontSize,
  );

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

  const checkAndTriggerCompletions = (
    currentCode,
    cursorIdx,
    force = false,
  ) => {
    if (readOnly) return;
    const { word, items } = getCompletions(currentCode, cursorIdx, {
      files,
      filepath,
      title,
      force,
    });
    if (items.length > 0) {
      setCompletionState((prev) => ({
        visible: true,
        word: word || "",
        items,
        selectedIndex:
          prev.visible && prev.word === word
            ? Math.min(prev.selectedIndex, items.length - 1)
            : 0,
      }));
    } else {
      setCompletionState({
        visible: false,
        word: "",
        items: [],
        selectedIndex: 0,
      });
    }
  };

  const handleApplyCompletion = (item) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const cursorIndex = textarea.selectionStart;
    const word = completionState.word;

    let newCode = code;
    let newCursorPos = cursorIndex;

    // 1. Позиционная замена диапазона (для строк импорта / модулей)
    if (item.replaceStart !== undefined && item.replaceEnd !== undefined) {
      const before = code.substring(0, item.replaceStart);
      const after = code.substring(item.replaceEnd);
      const insertText = item.insertText;
      newCode = before + insertText + after;

      if (item.cursorOffset !== undefined) {
        newCursorPos = item.replaceStart + item.cursorOffset;
      } else if (insertText.endsWith("'',") || insertText.endsWith("''")) {
        newCursorPos = item.replaceStart + insertText.indexOf("''") + 1;
      } else if (
        insertText.endsWith('="",') ||
        insertText.endsWith('=""') ||
        insertText.endsWith("={}")
      ) {
        newCursorPos = item.replaceStart + insertText.length - 1;
      } else if (insertText.endsWith("={{}}")) {
        newCursorPos = item.replaceStart + insertText.length - 2;
      } else if (insertText.endsWith("();")) {
        newCursorPos = item.replaceStart + insertText.length - 2;
      } else if (insertText.endsWith("()") || insertText.endsWith("<>")) {
        newCursorPos = item.replaceStart + insertText.length - 1;
      } else {
        newCursorPos = item.replaceStart + insertText.length;
      }

      // Если требуется авто-импорт в заголовок файла
      if (item.autoImport) {
        const importRes = addImportToFile(
          newCode,
          item.autoImport.symbol,
          item.autoImport.module,
          item.autoImport.isDefault,
        );
        if (importRes.insertedLength > 0) {
          newCode = importRes.newCode;
          if (importRes.insertIndex <= item.replaceStart) {
            newCursorPos += importRes.insertedLength;
          }
        }
      }
    }
    // 2. Сниппеты
    else if (item.kind === "snippet" && item.snippet) {
      const { newCode: expandedCode, newCursorPos: expCursor } = expandSnippet(
        code,
        cursorIndex,
        item.snippet,
        word,
        { filepath, title },
      );
      newCode = expandedCode;
      newCursorPos = expCursor;

      if (item.autoImport) {
        const importRes = addImportToFile(
          newCode,
          item.autoImport.symbol,
          item.autoImport.module,
          item.autoImport.isDefault,
        );
        if (importRes.insertedLength > 0) {
          newCode = importRes.newCode;
          newCursorPos += importRes.insertedLength;
        }
      }
    }
    // 3. Стандартная замена слова (хуки, переменные, ключевые слова с Auto-Import)
    else {
      const startReplace = Math.max(0, cursorIndex - word.length);
      const before = code.substring(0, startReplace);
      const after = code.substring(cursorIndex);
      const insertText = item.insertText;
      newCode = before + insertText + after;
      newCursorPos = startReplace + insertText.length;

      if (item.autoImport) {
        const importRes = addImportToFile(
          newCode,
          item.autoImport.symbol,
          item.autoImport.module,
          item.autoImport.isDefault,
        );
        if (importRes.insertedLength > 0) {
          newCode = importRes.newCode;
          newCursorPos += importRes.insertedLength;
        }
      }
    }

    updateCode(newCode);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
          newCursorPos;
        textareaRef.current.focus();
      }
    }, 0);

    setCompletionState({
      visible: false,
      word: "",
      items: [],
      selectedIndex: 0,
    });
  };

  const popoverRef = useRef(null);
  const listRef = useRef(null);

  // Автоскролл выбранного элемента в списке подсказок при навигации стрелками
  useEffect(() => {
    if (completionState.visible && listRef.current) {
      const activeEl = listRef.current.querySelector(".autocomplete-active");
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [completionState.selectedIndex, completionState.visible]);

  // Обновление положения поповера при скролле окна или изменении размера
  useEffect(() => {
    if (!completionState.visible) return;

    const handleWindowChange = () => {
      setCompletionState((prev) => (prev.visible ? { ...prev } : prev));
    };

    window.addEventListener("scroll", handleWindowChange, true);
    window.addEventListener("resize", handleWindowChange);
    return () => {
      window.removeEventListener("scroll", handleWindowChange, true);
      window.removeEventListener("resize", handleWindowChange);
    };
  }, [completionState.visible]);

  const calculatePopoverPos = () => {
    const textarea = textareaRef.current;
    if (!textarea)
      return { visible: false, top: 0, left: 0, placement: "bottom" };

    const rect = textarea.getBoundingClientRect();
    const pos = textarea.selectionStart;
    const textBefore = code.substring(0, pos);
    const lines = textBefore.split("\n");
    const lineNum = lines.length;
    const currentLineText = lines[lines.length - 1];
    const colNum = currentLineText.length;

    const lineH = fontSize * 1.6;
    const charW = fontSize * 0.6;
    const paddingTop = 14;
    const paddingLeft = 16;

    // Позиция строки внутри текстового поля с учетом скролла
    const lineTopInTextarea =
      paddingTop + (lineNum - 1) * lineH - (textarea.scrollTop || 0);
    const lineBottomInTextarea = lineTopInTextarea + lineH;

    // Экранные координаты курсора (для fixed portal)
    const cursorScreenX =
      rect.left + paddingLeft + colNum * charW - (textarea.scrollLeft || 0);
    const cursorScreenYBottom = rect.top + lineBottomInTextarea;
    const cursorScreenYTop = rect.top + lineTopInTextarea;

    // Если курсор скрыт за пределами видимой области редактора
    if (
      cursorScreenYBottom < rect.top - 10 ||
      cursorScreenYTop > rect.bottom + 10
    ) {
      return { visible: false, top: 0, left: 0, placement: "bottom" };
    }

    const popoverEstimatedHeight = Math.min(
      260,
      32 + (completionState.items.length || 1) * 28 + 8,
    );
    const popoverWidth = 320;

    const spaceBelow = window.innerHeight - cursorScreenYBottom;
    const spaceAbove = cursorScreenYTop;

    let placement = "bottom";
    let top = cursorScreenYBottom + 4;

    // Умный переворот вверх, если снизу нет места (например, перед консолью или внизу экрана)
    if (spaceBelow < popoverEstimatedHeight && spaceAbove > spaceBelow) {
      placement = "top";
      top = Math.max(10, cursorScreenYTop - popoverEstimatedHeight - 4);
    }

    // Защита от выхода за горизонтальные границы экрана
    const left = Math.max(
      12,
      Math.min(cursorScreenX, window.innerWidth - popoverWidth - 16),
    );

    return { visible: true, top, left, placement };
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

  // Смена задачи / восстановление сохраненного кода
  useEffect(() => {
    let isCancelled = false;

    if (readOnly) {
      setCode(initialCode);
      historyRef.current = [initialCode];
      historyIndexRef.current = 0;
      if (onChange) onChange(initialCode);
      return;
    }

    // 1. Проверяем синхронно L1-кэш памяти для мгновенного переключения (0ms)
    const cached = peekCachedSolution(taskId);
    if (cached !== null) {
      setCode(cached);
      historyRef.current = [cached];
      historyIndexRef.current = 0;
      if (onChange) onChange(cached);
      return;
    }

    setSaveStatus("saved");
    if (saveStatusTimerRef.current) {
      clearTimeout(saveStatusTimerRef.current);
    }

    // 2. Асинхронно запрашиваем из IndexedDB
    getSolution(taskId, initialCode)
      .then((loadedCode) => {
        if (!isCancelled) {
          const active = loadedCode !== null ? loadedCode : initialCode;
          setCode(active);
          historyRef.current = [active];
          historyIndexRef.current = 0;
          if (onChange) onChange(active);
        }
      })
      .catch((err) => {
        console.error("Failed to load task code from storage", err);
        if (!isCancelled) {
          setCode(initialCode);
          if (onChange) onChange(initialCode);
        }
      });

    return () => {
      isCancelled = true;
      flushPendingSaves();
      if (saveStatusTimerRef.current) {
        clearTimeout(saveStatusTimerRef.current);
      }
    };
  }, [taskId, initialCode, readOnly]);

  // Реакция на глобальный сброс решений (из модалки статистики или другой вкладки)
  useEffect(() => {
    const unsubscribe = subscribeToSyncEvents((event) => {
      if (event.type === "SOLUTIONS_CLEARED") {
        if (event.all) {
          setCode(initialCode);
          historyRef.current = [initialCode];
          historyIndexRef.current = 0;
          if (onChange) onChange(initialCode);
        } else if (event.taskIds && Array.isArray(event.taskIds)) {
          const stringTaskIds = event.taskIds.map(String);
          const baseId = String(taskId)
            .replace(/^(cand_|sol_)/, "")
            .replace(/_\d+_file_\d+$/, "")
            .replace(/_file_\d+$/, "");
          if (
            stringTaskIds.includes(baseId) ||
            stringTaskIds.includes(String(taskId))
          ) {
            setCode(initialCode);
            historyRef.current = [initialCode];
            historyIndexRef.current = 0;
            if (onChange) onChange(initialCode);
          }
        }
      }
    });
    return () => unsubscribe();
  }, [taskId, initialCode, onChange]);

  const pushHistory = (newCode) => {
    const nextHistory = historyRef.current.slice(
      0,
      historyIndexRef.current + 1,
    );
    if (nextHistory[nextHistory.length - 1] !== newCode) {
      nextHistory.push(newCode);
      if (nextHistory.length > 50) nextHistory.shift();
      historyRef.current = nextHistory;
      historyIndexRef.current = nextHistory.length - 1;
    }
  };

  const [saveStatus, setSaveStatus] = useState("saved"); // "saving" | "saved"
  const saveStatusTimerRef = useRef(null);

  const updateCode = (newCode, addToHistory = true) => {
    setCode(newCode);
    if (addToHistory) pushHistory(newCode);
    if (onChange) onChange(newCode);
    if (!readOnly && taskId) {
      setSaveStatus("saving");
      clearTimeout(saveStatusTimerRef.current);
      saveSolutionDebounced(taskId, newCode);
      saveStatusTimerRef.current = setTimeout(() => {
        setSaveStatus("saved");
      }, 450);
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
      deleteSolution(taskId);
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
    const fixed = fixTypoInCode(
      code,
      typoObj.line,
      typoObj.typo,
      typoObj.correct,
    );
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
    const selectedLength = Math.abs(
      textarea.selectionEnd - textarea.selectionStart,
    );
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
          selectedIndex:
            (prev.selectedIndex - 1 + prev.items.length) % prev.items.length,
        }));
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        const selectedItem =
          completionState.items[completionState.selectedIndex];
        if (selectedItem) {
          handleApplyCompletion(selectedItem);
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setCompletionState({
          visible: false,
          word: "",
          items: [],
          selectedIndex: 0,
        });
        return;
      }
    }

    // 0.1. Ручной вызов подсказок (IntelliSense): Ctrl+Space или Cmd+I / Cmd+Space
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.code === "Space" || e.key === " " || e.key.toLowerCase() === "i")
    ) {
      e.preventDefault();
      checkAndTriggerCompletions(code, start, true);
      return;
    }

    // 1. Горячие клавиши запуска: Ctrl+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (onRun) onRun(code);
      return;
    }

    // 1.1. Форматирование кода через Prettier: Shift+Alt+F или Ctrl+Alt+L
    if (
      (e.shiftKey && e.altKey && e.key.toLowerCase() === "f") ||
      ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === "l")
    ) {
      e.preventDefault();
      handleFormat();
      return;
    }

    // Изменение размера шрифта: Ctrl+ / Ctrl-
    const isIncreaseFont =
      (e.ctrlKey || e.metaKey) &&
      (e.key === "+" ||
        e.key === "=" ||
        e.code === "Equal" ||
        e.code === "NumpadAdd");

    const isDecreaseFont =
      (e.ctrlKey || e.metaKey) &&
      (e.key === "-" ||
        e.key === "_" ||
        e.code === "Minus" ||
        e.code === "NumpadSubtract");

    if (isIncreaseFont) {
      e.preventDefault();
      handleIncreaseFontSize();
      return;
    }

    if (isDecreaseFont) {
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
        const allCommented = lines
          .slice(curLineIdx, endLineIdx + 1)
          .every((l) => l.trim().startsWith("//") || !l.trim());

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

    // 4. Автозакрытие HTML / JSX тегов и фрагментов при нажатии '>'
    if (e.key === ">" && start === end) {
      const textBefore = code.substring(0, start);
      const textAfter = code.substring(end);
      const autoCloseTagResult = checkAutoCloseTag(textBefore, textAfter);

      if (autoCloseTagResult) {
        e.preventDefault();
        const closeTagStr = autoCloseTagResult.isFragment
          ? `></>`
          : `></${autoCloseTagResult.tagName}>`;
        const updated = code.substring(0, start) + closeTagStr + textAfter;
        updateCode(updated);

        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart =
              textareaRef.current.selectionEnd = start + 1;
          }
        }, 0);
        return;
      }
    }

    // 4.1. Автодополнение незакрытого тега при вводе '/' после '<'
    if (e.key === "/" && start === end) {
      const textBefore = code.substring(0, start);
      if (textBefore.endsWith("<")) {
        const unclosedTag = findLastUnclosedTag(textBefore.slice(0, -1));
        if (unclosedTag !== null) {
          e.preventDefault();
          const insertStr = unclosedTag === "" ? `/>` : `/${unclosedTag}>`;
          const updated =
            code.substring(0, start) + insertStr + code.substring(end);
          updateCode(updated);

          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart =
                textareaRef.current.selectionEnd = start + insertStr.length;
            }
          }, 0);
          return;
        }
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
      if (
        nextChar === e.key &&
        ["'", '"', "`", ")", "}", "]"].includes(e.key) &&
        start === end
      ) {
        e.preventDefault();
        textarea.selectionStart = textarea.selectionEnd = start + 1;
        return;
      }

      e.preventDefault();
      const open = e.key;
      const close = pairMap[open];
      const selected = code.substring(start, end);
      const updated =
        code.substring(0, start) +
        open +
        selected +
        close +
        code.substring(end);
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
        const updated =
          code.substring(0, start - 1) + code.substring(start + 1);
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

      if (
        (prevChar === "{" && nextChar === "}") ||
        (prevChar === ">" && nextChar === "<")
      ) {
        e.preventDefault();
        const extraIndent = currentIndent + "  ";
        const updated =
          code.substring(0, start) +
          "\n" +
          extraIndent +
          "\n" +
          currentIndent +
          code.substring(end);
        updateCode(updated);

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd =
            start + 1 + extraIndent.length;
        }, 0);
        return;
      }

      if (
        prevChar === "{" ||
        prevChar === "(" ||
        prevChar === "[" ||
        prevChar === ":"
      ) {
        e.preventDefault();
        const extraIndent = currentIndent + "  ";
        const updated =
          code.substring(0, start) + "\n" + extraIndent + code.substring(end);
        updateCode(updated);

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd =
            start + 1 + extraIndent.length;
        }, 0);
        return;
      }

      if (currentIndent.length > 0) {
        e.preventDefault();
        const updated =
          code.substring(0, start) + "\n" + currentIndent + code.substring(end);
        updateCode(updated);

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd =
            start + 1 + currentIndent.length;
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
            const updated =
              code.substring(0, lineStart) + code.substring(lineStart + 2);
            updateCode(updated);
            setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = Math.max(
                lineStart,
                start - 2,
              );
            }, 0);
          }
        } else {
          // Проверяем: не является ли текущая строка незавершенным импортом (import {useState}, import React, etc.)
          const textBefore = code.substring(0, start);
          const lineStart = textBefore.lastIndexOf("\n") + 1;
          const lineEnd = code.indexOf("\n", start);
          const effectiveEnd = lineEnd === -1 ? code.length : lineEnd;
          const currentLine = code.substring(lineStart, effectiveEnd);
          const currentFilepath = title || filepath || "main.jsx";

          const expandedImport = expandImportStatement(
            currentLine,
            files,
            currentFilepath,
          );

          if (expandedImport) {
            const updated =
              code.substring(0, lineStart) +
              expandedImport +
              code.substring(effectiveEnd);
            updateCode(updated);
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.selectionStart =
                  textareaRef.current.selectionEnd =
                    lineStart + expandedImport.length;
              }
            }, 0);
            return;
          }

          const updated =
            code.substring(0, start) + spaces + code.substring(end);
          updateCode(updated);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd =
              start + spaces.length;
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
          updatedLines = lines.map((l) =>
            l.startsWith("  ")
              ? l.substring(2)
              : l.startsWith(" ")
                ? l.substring(1)
                : l,
          );
        } else {
          updatedLines = lines.map((l) => spaces + l);
        }

        const updated =
          code.substring(0, lineStart) +
          updatedLines.join("\n") +
          code.substring(effectiveEnd);
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
      if (completionState.visible) {
        setCompletionState((prev) => ({ ...prev }));
      }
    }
  };

  const lines = (code || "").split("\n");
  const langInfo = useMemo(() => {
    const cleanPath = (filepath || title || "").toLowerCase();
    const fileExt = cleanPath.split(".").pop();

    if (fileExt === "tsx") {
      return { name: "React TSX", color: "var(--color-info)" };
    }
    if (fileExt === "jsx") {
      return { name: "React JSX", color: "var(--color-info)" };
    }
    if (fileExt === "ts") {
      return { name: "TypeScript", color: "var(--accent-blue)" };
    }

    const isReactCode =
      /<[a-zA-Z0-9_]+(\s+[^>]*|\s*\/)?>|<\/[a-zA-Z0-9_]+>|<>/m.test(code) ||
      /import\s+.*React|from\s+['"]react['"]|export\s+default\s+function/m.test(
        code,
      );

    if (cleanPath.includes("react") || isReactCode) {
      return { name: "React JSX", color: "var(--color-info)" };
    }

    return { name: "JavaScript", color: "var(--color-warning)" };
  }, [filepath, title, code]);

  const lineCount = lines.length;
  const isCodeModified = !readOnly && code !== initialCode;
  const activeLine = cursorPos.line;

  const cleanFilename = title || filepath.split("/").pop() || "main.js";

  // Текущая опечатка на активной строке курсора или первая в коде
  const activeTypo =
    diagnostics.typoMap[activeLine] || Object.values(diagnostics.typoMap)[0];

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
                disabled={
                  historyIndexRef.current >= historyRef.current.length - 1
                }
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
            data-tooltip={
              wordWrap
                ? "Выключить перенос длинных строк"
                : "Включить перенос длинных строк"
            }
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
            data-tooltip={
              copied ? "Скопировано в буфер обмена" : "Скопировать код решения"
            }
          >
            {copied ? (
              <Check size={14} style={{ color: "var(--color-success)" }} />
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

          {extraHeaderActions}

          <button
            className="vscode-icon-btn"
            onClick={handleToggleFullscreen}
            data-tooltip={
              isFullscreen
                ? "Свернуть редактор (Esc)"
                : "Развернуть редактор (open)"
            }
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Ненавязчивая плашка быстрого автоисправления опечаток (conts -> const) */}
      {activeTypo && (
        <div className="typo-quickfix-banner">
          <div className="typo-banner-left">
            <AlertCircle
              size={13}
              style={{ color: "var(--color-error-light)" }}
            />
            <span className="typo-msg">
              Стр {activeTypo.line}: Опечатка <code>{activeTypo.typo}</code>{" "}
              вместо <strong>{activeTypo.correct}</strong>
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
      <div
        className={`vscode-editor-surface ${wordWrap ? "wrap-on" : "wrap-off"}`}
      >
        {/* Номера строк с адаптивной шириной под количество цифр */}
        {(() => {
          const digits = String(Math.max(lineCount, 1)).length;
          const dynamicGutterWidth = Math.max(32, 20 + digits * 9);

          return (
            <div
              ref={gutterRef}
              className="vscode-gutter"
              aria-hidden="true"
              style={{
                width: `${dynamicGutterWidth}px`,
                minWidth: `${dynamicGutterWidth}px`,
              }}
            >
              {Array.from({ length: Math.max(lineCount, 1) }).map((_, i) => {
                const lineNum = i + 1;
                const hasError = diagnostics.problems.some(
                  (p) => p.line === lineNum && p.severity === "error",
                );

                return (
                  <div
                    key={i}
                    className={`vscode-gutter-line ${activeLine === lineNum ? "active-line-gutter" : ""} ${
                      hasError ? "gutter-has-error" : ""
                    }`}
                    title={
                      hasError ? "Ошибка синтаксиса или опечатка на строке" : ""
                    }
                  >
                    {hasError && <span className="gutter-error-dot">•</span>}
                    {lineNum}
                  </div>
                );
              })}
            </div>
          );
        })()}

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
              <pre
                ref={highlightRef}
                className="vscode-syntax-layer"
                aria-hidden="true"
              >
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

                  // Auto Rename Tag: синхронное переименование парного тега в <></>
                  const { updatedCode, newCursorPos } = handleAutoRenameTag(
                    code,
                    val,
                    pos,
                  );

                  updateCode(updatedCode);
                  updateCursorCoordinates();
                  checkAndTriggerCompletions(updatedCode, newCursorPos);

                  if (updatedCode !== val) {
                    setTimeout(() => {
                      if (textareaRef.current) {
                        textareaRef.current.selectionStart =
                          textareaRef.current.selectionEnd = newCursorPos;
                      }
                    }, 0);
                  }
                }}
                onKeyDown={handleKeyDown}
                onKeyUp={(e) => {
                  updateCursorCoordinates();
                  if (
                    ![
                      "ArrowUp",
                      "ArrowDown",
                      "Enter",
                      "Tab",
                      "Escape",
                    ].includes(e.key) &&
                    textareaRef.current
                  ) {
                    checkAndTriggerCompletions(
                      code,
                      textareaRef.current.selectionStart,
                    );
                  }
                }}
                onClick={() => {
                  updateCursorCoordinates();
                  if (textareaRef.current) {
                    checkAndTriggerCompletions(
                      code,
                      textareaRef.current.selectionStart,
                    );
                  }
                }}
                onSelect={() => {
                  updateCursorCoordinates();
                }}
                onFocus={() => {
                  setIsFocused(true);
                  updateCursorCoordinates();
                  if (textareaRef.current) {
                    checkAndTriggerCompletions(
                      code,
                      textareaRef.current.selectionStart,
                    );
                  }
                }}
                onBlur={() => {
                  setIsFocused(false);
                  setTimeout(() => {
                    setCompletionState({
                      visible: false,
                      word: "",
                      items: [],
                      selectedIndex: 0,
                    });
                  }, 200);
                }}
                onScroll={handleScroll}
                placeholder="// Напишите ваш код решения здесь..."
                spellCheck="false"
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
              />

              {/* Всплывающее меню подсказок и автодополнения (IntelliSense) через React Portal */}
              {completionState.visible &&
                completionState.items.length > 0 &&
                (() => {
                  const popoverPos = calculatePopoverPos();
                  if (popoverPos.visible === false) return null;
                  return createPortal(
                    <div
                      ref={popoverRef}
                      className={`autocomplete-popover placement-${popoverPos.placement}`}
                      style={{
                        top: `${popoverPos.top}px`,
                        left: `${popoverPos.left}px`,
                      }}
                    >
                      <div className="autocomplete-header">
                        <span>Подсказки для "{completionState.word}"</span>
                        <span className="autocomplete-hint">
                          ↑↓ выбор • Enter/Tab вставить
                        </span>
                      </div>
                      <div ref={listRef} className="autocomplete-list">
                        {completionState.items.map((item, idx) => {
                          const isSelected =
                            idx === completionState.selectedIndex;
                          return (
                            <div
                              key={idx}
                              className={`autocomplete-item ${isSelected ? "autocomplete-active" : ""}`}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleApplyCompletion(item);
                              }}
                              onMouseEnter={() => {
                                setCompletionState((prev) => ({
                                  ...prev,
                                  selectedIndex: idx,
                                }));
                              }}
                            >
                              <span
                                className={`autocomplete-kind-badge kind-${item.kind}`}
                              >
                                {item.kind === "snippet" ? (
                                  <Wand2 size={12} />
                                ) : item.kind === "hook" ? (
                                  <Sparkles size={12} />
                                ) : item.kind === "keyword" ? (
                                  <Code2 size={12} />
                                ) : item.kind === "variable" ? (
                                  <Box size={12} />
                                ) : item.kind === "import" ? (
                                  <FileCode size={12} />
                                ) : item.kind === "method" ? (
                                  <Code2 size={12} />
                                ) : item.kind === "property" ? (
                                  <Box size={12} />
                                ) : (
                                  <Globe size={12} />
                                )}
                              </span>
                              <span className="autocomplete-label">
                                {item.label}
                              </span>
                              <span className="autocomplete-detail">
                                {item.detail}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>,
                    document.body,
                  );
                })()}
            </div>
          )}
        </div>
      </div>

      {/* Минималистичный статус-бар с проверкой орфографии */}
      {!bottomConsole && (
        <div className="vscode-status-bar">
          <div className="status-left">
            {!readOnly && (
              <>
                <span
                  className={`status-item save-status-indicator ${saveStatus}`}
                  title={
                    saveStatus === "saving"
                      ? "Автосохранение в IndexedDB..."
                      : "Решение сохранено локально в IndexedDB"
                  }
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    color:
                      saveStatus === "saving"
                        ? "var(--accent-amber, #f59e0b)"
                        : "var(--color-success, #10b981)",
                    fontSize: "11.5px",
                    fontWeight: 500,
                    transition: "color 0.2s ease",
                  }}
                >
                  {saveStatus === "saving" ? (
                    <>
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: "currentColor",
                          display: "inline-block",
                        }}
                      />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Check size={11} style={{ strokeWidth: 2.5 }} />
                      Сохранено
                    </>
                  )}
                </span>
                <span className="status-sep">|</span>
              </>
            )}

            {diagnostics.errorCount > 0 ? (
              <span
                className="status-item status-typo-warning"
                title="Обнаружена синтаксическая опечатка"
              >
                <AlertCircle
                  size={11}
                  style={{ color: "var(--color-error-light)" }}
                />
                <span>
                  {diagnostics.errorCount}{" "}
                  {diagnostics.errorCount === 1 ? "ошибка" : "ошибок"}
                  {activeTypo && `: ${activeTypo.typo} → ${activeTypo.correct}`}
                </span>
              </span>
            ) : (
              <span className="status-item status-typo-ok">
                <CheckCircle2
                  size={11}
                  style={{ color: "var(--color-success-light)" }}
                />
                <span>Синтаксис корректен</span>
              </span>
            )}

            <span className="status-sep">|</span>

            <span className="status-item status-coords">
              Стр {cursorPos.line}, Кол {cursorPos.col}
            </span>
            <span className="status-sep">|</span>
            <span className="status-item">
              {lineCount}{" "}
              {lineCount === 1 ? "строка" : lineCount < 5 ? "строки" : "строк"}{" "}
              ({code.length} симв)
            </span>
          </div>

          <div className="status-right">
            <span className="status-item">Пробелы: 2</span>
            <span className="status-sep">|</span>
            <span className="status-item">UTF-8</span>
            <span className="status-sep">|</span>
            <span
              className="status-item lang-tag"
              title={`Язык синтаксиса: ${langInfo.name}`}
            >
              <Code2 size={11} style={{ color: langInfo.color }} />{" "}
              {langInfo.name}
            </span>
          </div>
        </div>
      )}

      {bottomConsole && (
        <div className="vscode-editor-bottom-console">{bottomConsole}</div>
      )}
    </div>
  );
};

export default CodeEditor;
