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
  Lightbulb,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Box,
  Globe,
  Search,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  X,
  CaseSensitive,
  WholeWord,
  Regex,
  Replace,
  ReplaceAll,
} from "lucide-react";
import { highlightJS, findMatchingBracketPair } from "../../utils/codeHighlighter";
import { getHoverInfo, getSignatureHelp } from "../../utils/typeSignatures";
import {
  getCompletions,
  expandSnippet,
  expandImportStatement,
  addImportToFile,
  findDefinition,
  getWordAtPosition,
  fuzzyMatch,
} from "../../utils/snippetsEngine";
import { Tooltip } from "./Tooltip";
import {
  checkAutoCloseTag,
  findLastUnclosedTag,
  handleAutoRenameTag,
} from "../../utils/tagEngine";
import { lintJavaScriptCode, fixTypoInCode } from "../../utils/codeLinter";
import { formatJavaScriptCode } from "../../utils/codeFormatter";
import { isEmmetAbbreviation, expandEmmetAbbreviation } from "../../utils/emmetEngine";
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

// Зарезервированные ключевые слова JS/TS (не подсвечиваются как повторы переменных)
const RESERVED_KEYWORDS = new Set([
  "const",
  "let",
  "var",
  "function",
  "return",
  "import",
  "export",
  "from",
  "default",
  "if",
  "else",
  "for",
  "while",
  "do",
  "switch",
  "case",
  "break",
  "continue",
  "try",
  "catch",
  "finally",
  "throw",
  "new",
  "typeof",
  "instanceof",
  "void",
  "delete",
  "in",
  "of",
  "async",
  "await",
  "class",
  "extends",
  "super",
  "this",
  "null",
  "undefined",
  "true",
  "false",
  "type",
  "interface",
  "as",
]);

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

  // Рефы DOM и истории
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);
  const gutterRef = useRef(null);
  const historyRef = useRef([initialCode]);
  const historyIndexRef = useRef(0);
  const lastHistoryTimeRef = useRef(0);
  const lastHistoryActionRef = useRef("init");
  const findInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const hoverTimerRef = useRef(null);
  const quickOpenInputRef = useRef(null);

  // Состояние встроенного виджета поиска и замены (Find & Replace)
  const [findState, setFindState] = useState({
    isOpen: false,
    showReplace: false,
    query: "",
    replaceText: "",
    matchCase: false,
    matchWholeWord: false,
    useRegex: false,
    currentIndex: -1,
  });

  // Состояние быстрого переключения файлов и перехода к строке (Quick Open Cmd+P / Cmd+G)
  const [quickOpenState, setQuickOpenState] = useState({
    isOpen: false,
    query: "",
    selectedIndex: 0,
    mode: "files", // "files" | "goto"
  });

  // Состояние всплывающей подсказки типа (Hover Tooltip)
  const [hoverState, setHoverState] = useState({
    visible: false,
    x: 0,
    y: 0,
    info: null,
    symbol: "",
  });

  // Состояние подсказки параметров функции (Parameter Signature Help)
  const [signatureHelpState, setSignatureHelpState] = useState({
    visible: false,
    info: null,
  });

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

  // Вычисление всех совпадений поискового запроса в коде
  const findMatches = useMemo(() => {
    if (!findState.isOpen || !findState.query || !code) return [];

    let regex = null;
    try {
      let pattern = findState.query;
      if (!findState.useRegex) {
        pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
      if (findState.matchWholeWord) {
        pattern = `\\b${pattern}\\b`;
      }
      const flags = findState.matchCase ? "g" : "gi";
      regex = new RegExp(pattern, flags);
    } catch (e) {
      return [];
    }

    const matches = [];
    let m;
    while ((m = regex.exec(code)) !== null) {
      if (m[0].length === 0) {
        regex.lastIndex++;
        continue;
      }
      const textBefore = code.substring(0, m.index);
      const line = textBefore.split("\n").length;
      matches.push({
        start: m.index,
        end: m.index + m[0].length,
        line,
        text: m[0],
      });
      if (!regex.global) break;
    }

    return matches;
  }, [
    code,
    findState.isOpen,
    findState.query,
    findState.matchCase,
    findState.matchWholeWord,
    findState.useRegex,
  ]);

  // Элементы быстрого перехода (Quick Open: файлы задачи или переход к строке)
  const quickOpenItems = useMemo(() => {
    if (!quickOpenState.isOpen) return [];
    const q = quickOpenState.query.trim();

    // 1. Режим перехода к строке: начинается с ':'
    if (q.startsWith(":")) {
      const lineMatch = q.match(/^:(\d+)(?::(\d+))?/);
      const targetLine = lineMatch ? parseInt(lineMatch[1], 10) : null;
      const targetCol = lineMatch && lineMatch[2] ? parseInt(lineMatch[2], 10) : 1;
      const totalLines = code.split("\n").length;

      return [
        {
          type: "goto",
          label: targetLine
            ? `Перейти к строке ${targetLine}${targetCol > 1 ? `, колонке ${targetCol}` : ""}`
            : "Введите номер строки для перехода (:строка[:колонка])...",
          targetLine: targetLine ? Math.max(1, Math.min(targetLine, totalLines)) : null,
          targetCol: targetCol || 1,
          totalLines,
          isValid: Boolean(targetLine && targetLine >= 1 && targetLine <= totalLines),
        },
      ];
    }

    // 2. Режим поиска файлов задачи
    if (!files || files.length === 0) {
      return [
        {
          type: "file",
          name: filepath || title || "index.jsx",
          detail: "Текущий файл задачи",
          fileIndex: 0,
          isCurrent: true,
          score: 100,
        },
      ];
    }

    const results = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const fileName = f.name || `file_${i}.jsx`;
      const { match, score } = fuzzyMatch(fileName, q);
      if (match || !q) {
        results.push({
          type: "file",
          name: fileName,
          detail: `Файл задачи #${i + 1}`,
          fileIndex: i,
          isCurrent: i === activeFileIdx,
          score: score + (i === activeFileIdx ? 10 : 0),
        });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results;
  }, [quickOpenState.isOpen, quickOpenState.query, files, filepath, title, activeFileIdx, code]);

  // Определение слова под курсором и парных скобок для умной подсветки (Word Highlight & Bracket Match)
  const highlightOptions = useMemo(() => {
    if (readOnly || !code) return { highlightWord: "", bracketPair: null };
    const textarea = textareaRef.current;
    const currentCursor = textarea ? textarea.selectionStart : 0;

    const bracketPair = isFocused ? findMatchingBracketPair(code, currentCursor) : null;

    let activeWord = "";
    if (findState.isOpen && findState.query) {
      activeWord = findState.query;
    } else if (isFocused) {
      const word = getWordAtPosition(code, currentCursor);
      if (
        word &&
        /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(word) &&
        word.length >= 2 &&
        !RESERVED_KEYWORDS.has(word)
      ) {
        activeWord = word;
      }
    }

    return {
      highlightWord: activeWord,
      bracketPair,
      problems: diagnostics.problems,
      unusedImports: diagnostics.unusedImports,
    };
  }, [
    code,
    isFocused,
    cursorPos.line,
    cursorPos.col,
    readOnly,
    findState.isOpen,
    findState.query,
    diagnostics.problems,
    diagnostics.unusedImports,
  ]);

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

    // Синхронизация парных JSX тегов при автодополнении тегов (Auto Rename Tag: <></> -> <div></div>)
    const renameRes = handleAutoRenameTag(code, newCode, newCursorPos);
    newCode = renameRes.updatedCode;
    newCursorPos = renameRes.newCursorPos;

    updateCode(newCode, "completion");
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

  // Живая проверка синтаксиса и отсутствующих импортов при изменении кода
  useEffect(() => {
    const result = lintJavaScriptCode(code, { files, filepath, title });
    setDiagnostics(result);
  }, [code, files, filepath, title]);

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

  const pushHistory = (newCode, actionType = "type") => {
    const nextHistory = historyRef.current.slice(
      0,
      historyIndexRef.current + 1,
    );
    const currentTop = nextHistory[nextHistory.length - 1];
    if (currentTop === newCode) return;

    const now = Date.now();
    const timeDelta = now - lastHistoryTimeRef.current;
    const isContinuousTyping =
      actionType === "type" &&
      lastHistoryActionRef.current === "type" &&
      timeDelta < 800 &&
      Math.abs(newCode.length - (currentTop ? currentTop.length : 0)) === 1;

    if (isContinuousTyping && historyIndexRef.current > 0) {
      // Обновляем текущий шаг истории вместо раздувания на каждую букву
      nextHistory[nextHistory.length - 1] = newCode;
      historyRef.current = nextHistory;
    } else {
      // Создаем новую точку отката (пауза > 800ms, вставка, форматирование, сниппет, перенос строки, удаление блока)
      nextHistory.push(newCode);
      if (nextHistory.length > 80) nextHistory.shift();
      historyRef.current = nextHistory;
      historyIndexRef.current = nextHistory.length - 1;
    }

    lastHistoryTimeRef.current = now;
    lastHistoryActionRef.current = actionType;
  };

  const [saveStatus, setSaveStatus] = useState("saved"); // "saving" | "saved"
  const saveStatusTimerRef = useRef(null);

  const updateCode = (newCode, actionType = "type") => {
    setCode(newCode);
    if (actionType !== false) {
      pushHistory(newCode, typeof actionType === "string" ? actionType : "type");
    }
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

  // Управление виджетом Поиска и Замены (Find & Replace)
  const handleOpenFind = (showReplace = false) => {
    if (readOnly) return;
    const textarea = textareaRef.current;
    let initialQuery = findState.query;

    if (textarea && textarea.selectionStart !== textarea.selectionEnd) {
      const selected = code.substring(
        textarea.selectionStart,
        textarea.selectionEnd,
      );
      if (selected && !selected.includes("\n") && selected.length < 80) {
        initialQuery = selected;
      }
    }

    setFindState((prev) => ({
      ...prev,
      isOpen: true,
      showReplace,
      query: initialQuery,
      currentIndex: initialQuery ? 0 : -1,
    }));

    setTimeout(() => {
      if (showReplace && replaceInputRef.current && initialQuery) {
        replaceInputRef.current.focus();
        replaceInputRef.current.select();
      } else if (findInputRef.current) {
        findInputRef.current.focus();
        findInputRef.current.select();
      }
    }, 50);
  };

  const handleCloseFind = () => {
    setFindState((prev) => ({ ...prev, isOpen: false }));
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Управление быстрым открытием файлов и переходом к строке (Quick Open & Go to Line)
  const handleOpenQuickOpen = (mode = "files") => {
    if (readOnly) return;
    setQuickOpenState({
      isOpen: true,
      query: mode === "goto" ? ":" : "",
      selectedIndex: 0,
      mode,
    });
    setTimeout(() => {
      quickOpenInputRef.current?.focus();
      quickOpenInputRef.current?.select();
    }, 50);
  };

  const handleCloseQuickOpen = () => {
    setQuickOpenState({ isOpen: false, query: "", selectedIndex: 0, mode: "files" });
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleJumpToLine = (targetLine, targetCol = 1) => {
    const textarea = textareaRef.current;
    if (!textarea || !code) return;

    const lines = code.split("\n");
    const validLine = Math.max(1, Math.min(targetLine, lines.length));
    let charIndex = 0;
    for (let i = 0; i < validLine - 1; i++) {
      charIndex += lines[i].length + 1;
    }
    const lineLen = lines[validLine - 1]?.length || 0;
    const validCol = Math.max(1, Math.min(targetCol, lineLen + 1));
    charIndex += (validCol - 1);

    textarea.selectionStart = charIndex;
    textarea.selectionEnd = charIndex;
    updateCursorCoordinates();

    const lineH = fontSize * 1.6;
    const targetScroll = Math.max(0, (validLine - 5) * lineH);
    textarea.scrollTop = targetScroll;
    if (highlightRef.current) highlightRef.current.scrollTop = targetScroll;
    if (gutterRef.current) gutterRef.current.scrollTop = targetScroll;
  };

  const handleApplyQuickOpen = (item) => {
    if (!item) return;

    if (item.type === "goto") {
      if (item.targetLine) {
        handleJumpToLine(item.targetLine, item.targetCol);
      }
    } else if (item.type === "file") {
      if (typeof onFileSelect === "function" && typeof item.fileIndex === "number") {
        onFileSelect(item.fileIndex);
      }
    }

    handleCloseQuickOpen();
  };

  const handleSelectFindMatch = (index) => {
    if (findMatches.length === 0 || index < 0 || index >= findMatches.length)
      return;
    setFindState((prev) => ({ ...prev, currentIndex: index }));

    const match = findMatches[index];
    if (textareaRef.current) {
      textareaRef.current.selectionStart = match.start;
      textareaRef.current.selectionEnd = match.end;
      const lineHeight = 21;
      textareaRef.current.scrollTop = Math.max(
        0,
        (match.line - 5) * lineHeight,
      );
    }
  };

  const handleFindNext = () => {
    if (findMatches.length === 0) return;
    const nextIdx = (findState.currentIndex + 1) % findMatches.length;
    handleSelectFindMatch(nextIdx);
  };

  const handleFindPrev = () => {
    if (findMatches.length === 0) return;
    const prevIdx =
      (findState.currentIndex - 1 + findMatches.length) % findMatches.length;
    handleSelectFindMatch(prevIdx);
  };

  const handleReplaceCurrent = () => {
    if (findMatches.length === 0 || findState.currentIndex < 0) return;
    const match = findMatches[findState.currentIndex];
    if (!match) return;

    const updated =
      code.substring(0, match.start) +
      findState.replaceText +
      code.substring(match.end);
    updateCode(updated, "replace");

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = match.start;
        textareaRef.current.selectionEnd =
          match.start + findState.replaceText.length;
      }
    }, 0);
  };

  const handleReplaceAllMatches = () => {
    if (findMatches.length === 0 || !findState.query) return;

    let pattern = findState.query;
    if (!findState.useRegex) {
      pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    if (findState.matchWholeWord) {
      pattern = `\\b${pattern}\\b`;
    }
    const flags = findState.matchCase ? "g" : "gi";
    try {
      const regex = new RegExp(pattern, flags);
      const updated = code.replace(regex, findState.replaceText);
      updateCode(updated, "replace-all");
    } catch (e) {
      console.error("Replace all error", e);
    }
  };

  const handleFormat = async () => {
    if (!code) return;
    try {
      const formatted = await formatJavaScriptCode(code);
      if (formatted && formatted !== code) {
        updateCode(formatted, "format");
      }
    } catch (err) {
      console.error("Failed to format code with Prettier", err);
    }
  };

  const handleReset = () => {
    updateCode(initialCode, "reset");
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
    updateCode(fixed, "fix");
    if (textareaRef.current) {
      textareaRef.current.value = fixed;
      textareaRef.current.focus();
    }
  };

  // Быстрое автоматическое добавление отсутствующего импорта (useState, createSlice, etc.)
  const handleFixMissingImport = (importObj) => {
    if (!importObj) return;
    const res = addImportToFile(
      code,
      importObj.symbol,
      importObj.module,
      importObj.isDefault,
    );
    if (res.insertedLength > 0) {
      updateCode(res.newCode, "import-fix");
      if (textareaRef.current) {
        textareaRef.current.value = res.newCode;
        textareaRef.current.focus();
      }
    }
  };

  // Переход к определению (Go to Definition / File Navigation: F12 или Cmd+Click)
  const handleGoToDefinition = (explicitWord = null, explicitPos = null) => {
    const textarea = textareaRef.current;
    if (!textarea && explicitPos === null) return;
    const pos = explicitPos !== null ? explicitPos : textarea.selectionStart;
    const word = explicitWord || getWordAtPosition(code, pos);
    if (!word) return;

    const currentFilepath = title || filepath || "main.jsx";
    const def = findDefinition(word, code, files, currentFilepath);

    if (!def) return;

    if (def.type === "file" && onFileSelect && typeof def.fileIndex === "number") {
      onFileSelect(def.fileIndex);
      return;
    }

    if (def.type === "local" && def.line) {
      const lines = code.split("\n");
      let charIndex = 0;
      for (let i = 0; i < def.line - 1 && i < lines.length; i++) {
        charIndex += lines[i].length + 1;
      }
      charIndex += Math.max(0, (def.col || 1) - 1);

      if (textarea) {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = charIndex;
        const lineHeight = 21;
        textarea.scrollTop = Math.max(0, (def.line - 5) * lineHeight);
      }
    }
  };

  // Умная вставка с автоматическим добавлением импортов (Auto-Import on Paste)
  const handlePaste = (e) => {
    if (readOnly) return;
    const pastedText = e.clipboardData?.getData("text");
    if (!pastedText) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    e.preventDefault();
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Вставляем текст
    const codeWithPasted = code.substring(0, start) + pastedText + code.substring(end);
    let finalCode = codeWithPasted;

    // Проверяем отсутствующие импорты в результирующем коде
    const currentFilepath = title || filepath || "main.jsx";
    const lintRes = lintJavaScriptCode(finalCode, { files, filepath: currentFilepath });

    if (lintRes.allMissingImports && lintRes.allMissingImports.length > 0) {
      for (const missing of lintRes.allMissingImports) {
        const symRegex = new RegExp(`\\b${missing.symbol}\\b`);
        if (symRegex.test(pastedText)) {
          const addRes = addImportToFile(finalCode, missing.symbol, missing.module, missing.isDefault);
          if (addRes.insertedLength > 0 && addRes.newCode) {
            finalCode = addRes.newCode;
          }
        }
      }
    }

    updateCode(finalCode, "paste");

    setTimeout(() => {
      if (textareaRef.current) {
        const diff = finalCode.length - codeWithPasted.length;
        const newCursor = start + pastedText.length + diff;
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = Math.min(newCursor, finalCode.length);
      }
    }, 0);
  };

  const handleMouseMove = (e) => {
    if (readOnly || completionState.visible) {
      if (hoverState.visible) setHoverState((prev) => ({ ...prev, visible: false }));
      return;
    }

    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }

    const clientX = e.clientX;
    const clientY = e.clientY;

    hoverTimerRef.current = setTimeout(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const rect = textarea.getBoundingClientRect();
      const x = clientX - rect.left - 16 + (textarea.scrollLeft || 0);
      const y = clientY - rect.top - 14 + (textarea.scrollTop || 0);
      const lineH = fontSize * 1.6;
      const charW = fontSize * 0.6;
      const lineIdx = Math.floor(y / lineH);
      const colIdx = Math.round(x / charW);
      const lines = code.split("\n");

      if (lineIdx < 0 || lineIdx >= lines.length) {
        setHoverState((prev) => (prev.visible ? { ...prev, visible: false } : prev));
        return;
      }

      let charPos = 0;
      for (let i = 0; i < lineIdx; i++) {
        charPos += lines[i].length + 1;
      }
      charPos += Math.max(0, Math.min(colIdx, lines[lineIdx].length));

      const word = getWordAtPosition(code, charPos);
      if (word && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(word)) {
        const info = getHoverInfo(word, code, charPos, { files, filepath });
        if (info) {
          setHoverState({
            visible: true,
            x: Math.min(clientX + 12, window.innerWidth - 450),
            y: Math.min(clientY + 18, window.innerHeight - 200),
            info,
            symbol: word,
          });
          return;
        }
      }
      setHoverState((prev) => (prev.visible ? { ...prev, visible: false } : prev));
    }, 180);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setHoverState((prev) => (prev.visible ? { ...prev, visible: false } : prev));
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

    // Parameter Signature Help
    if (!readOnly) {
      const sig = getSignatureHelp(code, pos);
      if (sig) {
        setSignatureHelpState({ visible: true, info: sig });
      } else {
        setSignatureHelpState((prev) => (prev.visible ? { visible: false, info: null } : prev));
      }
    }
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

    // 0.3. Встроенный поиск (Find & Replace): Ctrl+F / Cmd+F и Ctrl+H / Cmd+H
    if (
      (e.ctrlKey || e.metaKey) &&
      !e.shiftKey &&
      !e.altKey &&
      e.key.toLowerCase() === "f"
    ) {
      e.preventDefault();
      handleOpenFind(false);
      return;
    }

    if (
      (e.ctrlKey || e.metaKey) &&
      !e.shiftKey &&
      !e.altKey &&
      e.key.toLowerCase() === "h"
    ) {
      e.preventDefault();
      handleOpenFind(true);
      return;
    }

    // 0.4. Быстрый переход к файлам (Quick Open: Ctrl+P / Cmd+P) и строкам (Go to Line: Ctrl+G / Cmd+G)
    if (
      (e.ctrlKey || e.metaKey) &&
      !e.shiftKey &&
      !e.altKey &&
      e.key.toLowerCase() === "p"
    ) {
      e.preventDefault();
      handleOpenQuickOpen("files");
      return;
    }

    if (
      (e.ctrlKey || e.metaKey) &&
      !e.shiftKey &&
      !e.altKey &&
      e.key.toLowerCase() === "g"
    ) {
      e.preventDefault();
      handleOpenQuickOpen("goto");
      return;
    }

    // 0.2. Переход к определению (Go to Definition): F12
    if (e.key === "F12") {
      e.preventDefault();
      handleGoToDefinition(null, start);
      return;
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
      updateCode(updated, "comment");
      return;
    }

    // 3.1. Быстрое удаление строки: Ctrl+Shift+K или Cmd+Shift+K
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "k") {
      e.preventDefault();
      const lineStart = code.lastIndexOf("\n", start - 1) + 1;
      const lineEnd = code.indexOf("\n", end);
      let updated = "";
      let newCursor = lineStart;

      if (lineEnd === -1) {
        // Последняя строка файла
        if (lineStart > 0) {
          updated = code.substring(0, lineStart - 1);
          newCursor = lineStart - 1;
        } else {
          updated = "";
          newCursor = 0;
        }
      } else {
        updated = code.substring(0, lineStart) + code.substring(lineEnd + 1);
        newCursor = lineStart;
      }

      updateCode(updated, "delete-line");
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = Math.min(newCursor, updated.length);
        }
      }, 0);
      return;
    }

    // 3.2. Перемещение строк вверх/вниз: Alt+ArrowUp / Alt+ArrowDown (Option+Up / Option+Down)
    const isAltUp = e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey && e.key === "ArrowUp";
    const isAltDown = e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey && e.key === "ArrowDown";

    if (isAltUp || isAltDown) {
      e.preventDefault();
      const lines = code.split("\n");
      const firstLineIdx = code.substring(0, start).split("\n").length - 1;
      const lastLineIdx = code.substring(0, end).split("\n").length - 1;

      if (isAltUp && firstLineIdx > 0) {
        const targetLine = lines[firstLineIdx - 1];
        lines.splice(firstLineIdx - 1, 1);
        lines.splice(lastLineIdx, 0, targetLine);
        const updated = lines.join("\n");
        const shift = targetLine.length + 1;
        updateCode(updated, "move-line");
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = start - shift;
            textareaRef.current.selectionEnd = end - shift;
          }
        }, 0);
        return;
      }

      if (isAltDown && lastLineIdx < lines.length - 1) {
        const targetLine = lines[lastLineIdx + 1];
        lines.splice(lastLineIdx + 1, 1);
        lines.splice(firstLineIdx, 0, targetLine);
        const updated = lines.join("\n");
        const shift = targetLine.length + 1;
        updateCode(updated, "move-line");
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = start + shift;
            textareaRef.current.selectionEnd = end + shift;
          }
        }, 0);
        return;
      }
    }

    // 3.3. Дублирование строк: Shift+Alt+ArrowUp / Shift+Alt+ArrowDown (Shift+Option+Up/Down)
    const isDuplicateUp = e.altKey && e.shiftKey && !e.ctrlKey && !e.metaKey && e.key === "ArrowUp";
    const isDuplicateDown = e.altKey && e.shiftKey && !e.ctrlKey && !e.metaKey && e.key === "ArrowDown";

    if (isDuplicateUp || isDuplicateDown) {
      e.preventDefault();
      const lines = code.split("\n");
      const firstLineIdx = code.substring(0, start).split("\n").length - 1;
      const lastLineIdx = code.substring(0, end).split("\n").length - 1;
      const selectedLines = lines.slice(firstLineIdx, lastLineIdx + 1);
      const selectedBlock = selectedLines.join("\n");

      if (isDuplicateUp) {
        lines.splice(firstLineIdx, 0, ...selectedLines);
        const updated = lines.join("\n");
        updateCode(updated, "duplicate-line");
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = start;
            textareaRef.current.selectionEnd = end;
          }
        }, 0);
        return;
      }

      if (isDuplicateDown) {
        lines.splice(lastLineIdx + 1, 0, ...selectedLines);
        const updated = lines.join("\n");
        const shift = selectedBlock.length + 1;
        updateCode(updated, "duplicate-line");
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = start + shift;
            textareaRef.current.selectionEnd = end + shift;
          }
        }, 0);
        return;
      }
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
        updateCode(updated, "tag");

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
          updateCode(updated, "tag");

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

    // 5. Автозакрытие скобок и кавычек / Оборачивание выделения (Surround Selection)
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
      updateCode(updated, "bracket");

      setTimeout(() => {
        if (start === end) {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        } else {
          textarea.selectionStart = start + 1;
          textarea.selectionEnd = start + 1 + selected.length;
        }
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
        updateCode(updated, "bracket");
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
        updateCode(updated, "newline");

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
        updateCode(updated, "newline");

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
        updateCode(updated, "newline");

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd =
            start + 1 + currentIndent.length;
        }, 0);
        return;
      }
    }

    // 8. Tab / Shift+Tab (Отступ 2 пробела / Обратный отступ / Многострочный отступ)
    if (e.key === "Tab") {
      e.preventDefault();
      const spaces = "  ";

      // 8.1. Одиночный курсор Tab / Shift+Tab
      if (start === end) {
        if (e.shiftKey) {
          const lineStart = code.lastIndexOf("\n", start - 1) + 1;
          if (code.startsWith("  ", lineStart)) {
            const updated =
              code.substring(0, lineStart) + code.substring(lineStart + 2);
            updateCode(updated, "indent");
            setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = Math.max(
                lineStart,
                start - 2,
              );
            }, 0);
          } else if (code.startsWith(" ", lineStart)) {
            const updated =
              code.substring(0, lineStart) + code.substring(lineStart + 1);
            updateCode(updated, "indent");
            setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = Math.max(
                lineStart,
                start - 1,
              );
            }, 0);
          }
          return;
        }

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
          updateCode(updated, "expand-import");
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart =
                textareaRef.current.selectionEnd =
                  lineStart + expandedImport.length;
            }
          }, 0);
          return;
        }

        // 8.2. Проверяем: не является ли слово перед курсором Emmet-аббревиатурой (div.card>button.btn*2)
        const lineBeforeCursor = code.substring(lineStart, start);
        const emmetMatch = lineBeforeCursor.match(/([a-zA-Z0-9_$.#:>+*^=$/-]+)$/);
        if (emmetMatch && isEmmetAbbreviation(emmetMatch[1]) && /[.#>+*\[{]/.test(emmetMatch[1])) {
          const abbr = emmetMatch[1];
          const lineIndent = lineBeforeCursor.match(/^(\s*)/)?.[1] || "";
          const expanded = expandEmmetAbbreviation(abbr, lineIndent);
          if (expanded) {
            const repStart = start - abbr.length;
            const updated = code.substring(0, repStart) + expanded + code.substring(end);
            updateCode(updated, "emmet");
            setTimeout(() => {
              if (textareaRef.current) {
                const newPos = repStart + expanded.length;
                textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newPos;
                updateCursorCoordinates();
              }
            }, 0);
            return;
          }
        }

        const updated =
          code.substring(0, start) + spaces + code.substring(end);
        updateCode(updated, "indent");
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd =
            start + spaces.length;
        }, 0);
        return;
      }

      // 8.2. Многострочное выделение Tab / Shift+Tab (Indent / Outdent всего блока)
      const lineStart = code.lastIndexOf("\n", start - 1) + 1;
      const lineEnd = code.indexOf("\n", end);
      const effectiveEnd = lineEnd === -1 ? code.length : lineEnd;
      const selectedBlock = code.substring(lineStart, effectiveEnd);
      const lines = selectedBlock.split("\n");

      let firstLineShift = 0;
      let totalShift = 0;

      let updatedLines;
      if (e.shiftKey) {
        updatedLines = lines.map((l, idx) => {
          let removed = 0;
          let res = l;
          if (res.startsWith("  ")) {
            res = res.substring(2);
            removed = 2;
          } else if (res.startsWith(" ")) {
            res = res.substring(1);
            removed = 1;
          }
          if (idx === 0) firstLineShift = removed;
          totalShift += removed;
          return res;
        });
      } else {
        updatedLines = lines.map((l, idx) => {
          if (idx === 0) firstLineShift = 2;
          totalShift += 2;
          return spaces + l;
        });
      }

      const updated =
        code.substring(0, lineStart) +
        updatedLines.join("\n") +
        code.substring(effectiveEnd);

      updateCode(updated, "indent");

      const newSelectionStart = e.shiftKey
        ? Math.max(lineStart, start - firstLineShift)
        : start + firstLineShift;
      const newSelectionEnd = e.shiftKey
        ? Math.max(newSelectionStart, end - totalShift)
        : end + totalShift;

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = newSelectionStart;
          textareaRef.current.selectionEnd = newSelectionEnd;
        }
      }, 0);
      return;
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

  // Текущий отсутствующий импорт на активной строке курсора или первый в коде
  const activeMissingImport =
    (diagnostics.missingImportMap && diagnostics.missingImportMap[activeLine]) ||
    (diagnostics.allMissingImports && diagnostics.allMissingImports[0]);

  return (
    <Tooltip.Provider delayDuration={500} skipDelayDuration={250}>
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
                <Tooltip content="Отменить (Ctrl+Z)" side="bottom">
                  <button
                    className="vscode-icon-btn"
                    onClick={handleUndo}
                    disabled={historyIndexRef.current <= 0}
                    aria-label="Отменить (Ctrl+Z)"
                  >
                    <Undo2 size={14} />
                  </button>
                </Tooltip>
                <Tooltip content="Повторить (Ctrl+Y)" side="bottom">
                  <button
                    className="vscode-icon-btn"
                    onClick={handleRedo}
                    disabled={
                      historyIndexRef.current >= historyRef.current.length - 1
                    }
                    aria-label="Повторить (Ctrl+Y)"
                  >
                    <Redo2 size={14} />
                  </button>
                </Tooltip>
                <Tooltip content="Форматировать код (Shift+Alt+F)" side="bottom">
                  <button
                    className="vscode-icon-btn"
                    onClick={handleFormat}
                    aria-label="Форматировать код (Prettier)"
                  >
                    <Wand2 size={14} />
                  </button>
                </Tooltip>
              </>
            )}

            <Tooltip
              content={
                wordWrap
                  ? "Выключить перенос строк"
                  : "Включить перенос строк (Alt+Z)"
              }
              side="bottom"
            >
              <button
                className={`vscode-icon-btn ${wordWrap ? "active" : ""}`}
                onClick={() => setWordWrap((prev) => !prev)}
                aria-label="Перенос строк"
              >
                <WrapText size={14} />
              </button>
            </Tooltip>

            <Tooltip content="Поиск и замена (Ctrl+F)" side="bottom">
              <button
                className={`vscode-icon-btn ${findState.isOpen ? "active" : ""}`}
                onClick={() => {
                  if (findState.isOpen) handleCloseFind();
                  else handleOpenFind(false);
                }}
                aria-label="Поиск и замена в файле (Ctrl+F)"
              >
                <Search size={14} />
              </button>
            </Tooltip>

            <Tooltip content="Быстрый переход (Ctrl+P)" side="bottom">
              <button
                className={`vscode-icon-btn ${quickOpenState.isOpen ? "active" : ""}`}
                onClick={() => {
                  if (quickOpenState.isOpen) handleCloseQuickOpen();
                  else handleOpenQuickOpen("files");
                }}
                aria-label="Быстрый переход к файлам и строкам (Ctrl+P)"
              >
                <FileCode size={14} />
              </button>
            </Tooltip>

            {isCodeModified && (
              <Tooltip content="Сбросить код к исходному шаблону" side="bottom">
                <button
                  className="vscode-icon-btn"
                  onClick={handleReset}
                  aria-label="Сбросить код"
                >
                  <RotateCcw size={14} />
                </button>
              </Tooltip>
            )}

            {/* Кнопка копирования: только иконка */}
            <Tooltip
              content={
                copied ? "Скопировано в буфер!" : "Скопировать код решения"
              }
              side="bottom"
            >
              <button
                className="vscode-icon-btn"
                onClick={handleCopy}
                aria-label="Скопировать код"
              >
                {copied ? (
                  <Check size={14} style={{ color: "var(--color-success)" }} />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </Tooltip>

            <Tooltip
              content={
                fontSize <= MIN_FONT_SIZE
                  ? `Минимальный размер (${MIN_FONT_SIZE}px)`
                  : `Уменьшить шрифт (${fontSize}px, Ctrl -)`
              }
              side="bottom"
            >
              <button
                className="vscode-icon-btn"
                onClick={handleDecreaseFontSize}
                disabled={fontSize <= MIN_FONT_SIZE}
                aria-label="Уменьшить шрифт"
              >
                <ZoomOut size={14} />
              </button>
            </Tooltip>

            <Tooltip
              content={
                fontSize >= MAX_FONT_SIZE
                  ? `Максимальный размер (${MAX_FONT_SIZE}px)`
                  : `Увеличить шрифт (${fontSize}px, Ctrl +)`
              }
              side="bottom"
            >
              <button
                className="vscode-icon-btn"
                onClick={handleIncreaseFontSize}
                disabled={fontSize >= MAX_FONT_SIZE}
                aria-label="Увеличить шрифт"
              >
                <ZoomIn size={14} />
              </button>
            </Tooltip>

            {extraHeaderActions}

            <Tooltip
              content={
                isFullscreen
                  ? "Свернуть редактор (Esc)"
                  : "Развернуть редактор (/open)"
              }
              side="bottom"
            >
              <button
                className="vscode-icon-btn"
                onClick={handleToggleFullscreen}
                aria-label={isFullscreen ? "Свернуть редактор" : "Развернуть редактор"}
              >
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            </Tooltip>
        </div>
      </div>

      {/* Ненавязчивая плашка быстрого автоисправления опечаток и добавления импортов в стиле VS Code */}
      {activeTypo ? (
        <div className="vscode-quickfix-banner typo-quickfix-banner">
          <div className="typo-banner-left">
            <AlertCircle
              size={13}
              className="vscode-quickfix-icon-error"
            />
            <span className="typo-msg">
              Стр {activeTypo.line}: Опечатка <code className="typo-error-word">{activeTypo.typo}</code>{" "}
              вместо <strong>{activeTypo.correct}</strong>
            </span>
          </div>
          <Tooltip content={`Заменить '${activeTypo.typo}' на '${activeTypo.correct}'`} side="bottom">
            <button
              className="vscode-quickfix-btn typo-fix-btn"
              onClick={() => handleFixTypo(activeTypo)}
              aria-label={`Заменить '${activeTypo.typo}' на '${activeTypo.correct}'`}
            >
              <Wand2 size={12} />
              <span>Исправить на {activeTypo.correct}</span>
            </button>
          </Tooltip>
        </div>
      ) : activeMissingImport ? (
        <div className="vscode-quickfix-banner typo-quickfix-banner">
          <div className="typo-banner-left">
            <Lightbulb
              size={13}
              className="vscode-quickfix-icon-bulb"
            />
            <span className="typo-msg">
              Стр {activeMissingImport.line}: <code>{activeMissingImport.symbol}</code> не импортирован из{" "}
              <strong className="import-mod-name">'{activeMissingImport.module}'</strong>
            </span>
          </div>
          <Tooltip
            content={`Добавить import ${
              activeMissingImport.isDefault
                ? activeMissingImport.symbol
                : `{ ${activeMissingImport.symbol} }`
            } from '${activeMissingImport.module}'`}
            side="bottom"
          >
            <button
              className="vscode-quickfix-btn typo-fix-btn"
              onClick={() => handleFixMissingImport(activeMissingImport)}
              aria-label="Добавить импорт"
            >
              <Wand2 size={12} />
              <span>Добавить импорт ({activeMissingImport.module})</span>
            </button>
          </Tooltip>
        </div>
      ) : null}

      {/* Рабочая область редактора */}
      <div
        className={`vscode-editor-surface ${wordWrap ? "wrap-on" : "wrap-off"}`}
      >
        {/* Встроенный плавающий виджет поиска и замены (Find & Replace) */}
        {findState.isOpen && (
          <div
            className="vscode-find-widget"
            role="search"
            aria-label="Поиск и замена"
          >
            {/* Верхняя строка: Поиск */}
            <div className="vscode-find-row">
              <Tooltip
                content={
                  findState.showReplace
                    ? "Скрыть замену"
                    : "Показать замену (Ctrl+H)"
                }
                side="bottom"
              >
                <button
                  className="vscode-find-toggle-btn"
                  onClick={() =>
                    setFindState((prev) => ({
                      ...prev,
                      showReplace: !prev.showReplace,
                    }))
                  }
                  aria-label="Показать/скрыть замену"
                >
                  <ChevronRight
                    size={14}
                    style={{
                      transform: findState.showReplace
                        ? "rotate(90deg)"
                        : "none",
                      transition: "transform 0.15s ease",
                    }}
                  />
                </button>
              </Tooltip>

              <div className="vscode-find-input-wrap">
                <input
                  ref={findInputRef}
                  type="text"
                  className="vscode-find-input"
                  placeholder="Поиск..."
                  value={findState.query}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFindState((prev) => ({
                      ...prev,
                      query: val,
                      currentIndex: 0,
                    }));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (e.shiftKey) handleFindPrev();
                      else handleFindNext();
                    } else if (e.key === "Escape") {
                      e.preventDefault();
                      handleCloseFind();
                    } else if (e.altKey && e.key.toLowerCase() === "c") {
                      e.preventDefault();
                      setFindState((prev) => ({
                        ...prev,
                        matchCase: !prev.matchCase,
                      }));
                    } else if (e.altKey && e.key.toLowerCase() === "w") {
                      e.preventDefault();
                      setFindState((prev) => ({
                        ...prev,
                        matchWholeWord: !prev.matchWholeWord,
                      }));
                    } else if (e.altKey && e.key.toLowerCase() === "r") {
                      e.preventDefault();
                      setFindState((prev) => ({
                        ...prev,
                        useRegex: !prev.useRegex,
                      }));
                    }
                  }}
                />

                <Tooltip content="С учетом регистра (Alt+C)" side="bottom">
                  <button
                    className={`vscode-find-toggle-btn ${findState.matchCase ? "active" : ""}`}
                    onClick={() =>
                      setFindState((prev) => ({
                        ...prev,
                        matchCase: !prev.matchCase,
                      }))
                    }
                    aria-label="С учетом регистра"
                  >
                    <CaseSensitive size={14} />
                  </button>
                </Tooltip>

                <Tooltip content="Слово целиком (Alt+W)" side="bottom">
                  <button
                    className={`vscode-find-toggle-btn ${findState.matchWholeWord ? "active" : ""}`}
                    onClick={() =>
                      setFindState((prev) => ({
                        ...prev,
                        matchWholeWord: !prev.matchWholeWord,
                      }))
                    }
                    aria-label="Слово целиком"
                  >
                    <WholeWord size={14} />
                  </button>
                </Tooltip>

                <Tooltip content="Использовать регулярное выражение (Alt+R)" side="bottom">
                  <button
                    className={`vscode-find-toggle-btn ${findState.useRegex ? "active" : ""}`}
                    onClick={() =>
                      setFindState((prev) => ({
                        ...prev,
                        useRegex: !prev.useRegex,
                      }))
                    }
                    aria-label="Регулярное выражение"
                  >
                    <Regex size={14} />
                  </button>
                </Tooltip>
              </div>

              <div className="vscode-find-count">
                {!findState.query
                  ? "0 совп."
                  : findMatches.length > 0
                    ? `${findState.currentIndex + 1} из ${findMatches.length}`
                    : "Нет совп."}
              </div>

              <Tooltip content="Предыдущее совпадение (Shift+Enter)" side="bottom">
                <button
                  className="vscode-find-action-btn"
                  onClick={handleFindPrev}
                  disabled={findMatches.length === 0}
                  aria-label="Предыдущее совпадение"
                >
                  <ChevronUp size={14} />
                </button>
              </Tooltip>

              <Tooltip content="Следующее совпадение (Enter)" side="bottom">
                <button
                  className="vscode-find-action-btn"
                  onClick={handleFindNext}
                  disabled={findMatches.length === 0}
                  aria-label="Следующее совпадение"
                >
                  <ChevronDown size={14} />
                </button>
              </Tooltip>

              <Tooltip content="Закрыть (Escape)" side="bottom">
                <button
                  className="vscode-find-action-btn"
                  onClick={handleCloseFind}
                  aria-label="Закрыть поиск"
                >
                  <X size={14} />
                </button>
              </Tooltip>
            </div>

            {/* Нижняя строка: Замена */}
            {findState.showReplace && (
              <div className="vscode-find-row" style={{ paddingLeft: "24px" }}>
                <div className="vscode-find-input-wrap">
                  <input
                    ref={replaceInputRef}
                    type="text"
                    className="vscode-find-input"
                    placeholder="Заменить на..."
                    value={findState.replaceText}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFindState((prev) => ({
                        ...prev,
                        replaceText: val,
                      }));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if ((e.ctrlKey || e.metaKey) && e.altKey) {
                          handleReplaceAllMatches();
                        } else {
                          handleReplaceCurrent();
                        }
                      } else if (e.key === "Escape") {
                        e.preventDefault();
                        handleCloseFind();
                      }
                    }}
                  />
                </div>

                <Tooltip content="Заменить текущее (Enter)" side="bottom">
                  <button
                    className="vscode-replace-btn-text"
                    onClick={handleReplaceCurrent}
                    disabled={findMatches.length === 0}
                    aria-label="Заменить текущее"
                  >
                    <Replace
                      size={13}
                      style={{
                        display: "inline",
                        verticalAlign: "middle",
                        marginRight: 4,
                      }}
                    />
                    Заменить
                  </button>
                </Tooltip>

                <Tooltip content="Заменить все совпадения (Ctrl+Alt+Enter)" side="bottom">
                  <button
                    className="vscode-replace-btn-text"
                    onClick={handleReplaceAllMatches}
                    disabled={findMatches.length === 0}
                    aria-label="Заменить все совпадения"
                  >
                    <ReplaceAll
                      size={13}
                      style={{
                        display: "inline",
                        verticalAlign: "middle",
                        marginRight: 4,
                      }}
                    />
                    Все
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
        )}
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
                    __html: highlightJS(code + "\n", highlightOptions),
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
                      "ArrowLeft",
                      "ArrowRight",
                      "Home",
                      "End",
                      "PageUp",
                      "PageDown",
                      "Enter",
                      "Tab",
                      "Escape",
                      "Control",
                      "Alt",
                      "Shift",
                      "Meta",
                      "CapsLock",
                    ].includes(e.key) &&
                    textareaRef.current
                  ) {
                    checkAndTriggerCompletions(
                      code,
                      textareaRef.current.selectionStart,
                    );
                  }
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onPaste={handlePaste}
                onClick={(e) => {
                  updateCursorCoordinates();
                  if ((e.ctrlKey || e.metaKey) && textareaRef.current) {
                    handleGoToDefinition(null, textareaRef.current.selectionStart);
                    return;
                  }
                  // При клике мышкой закрываем меню автодополнения, чтобы не мешать просмотру вхождений и текста
                  if (completionState.visible) {
                    setCompletionState({
                      visible: false,
                      word: "",
                      items: [],
                      selectedIndex: 0,
                    });
                  }
                }}
                onSelect={() => {
                  updateCursorCoordinates();
                }}
                onFocus={() => {
                  setIsFocused(true);
                  updateCursorCoordinates();
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

              {/* Hover Tooltip Widget через React Portal */}
              {hoverState.visible && hoverState.info && createPortal(
                <div
                  className="vscode-hover-widget"
                  style={{
                    top: `${hoverState.y}px`,
                    left: `${hoverState.x}px`,
                  }}
                >
                  <div className="vscode-hover-header">
                    {hoverState.info.signature}
                  </div>
                  {hoverState.info.description && (
                    <div className="vscode-hover-body">
                      {hoverState.info.description}
                    </div>
                  )}
                  <div className="vscode-hover-footer">
                    <span>{hoverState.info.module ? `Модуль: ${hoverState.info.module}` : "Символ"}</span>
                    <span>VS Code IntelliSense</span>
                  </div>
                </div>,
                document.body
              )}

              {/* Parameter Signature Help Widget через React Portal */}
              {signatureHelpState.visible && signatureHelpState.info && !completionState.visible && (() => {
                const popoverPos = calculatePopoverPos();
                if (popoverPos.visible === false) return null;
                const sig = signatureHelpState.info;
                const activeIdx = Math.min(sig.activeParameter, sig.parameters.length - 1);
                const activeParam = sig.parameters[activeIdx];

                return createPortal(
                  <div
                    className="vscode-signature-help"
                    style={{
                      top: `${Math.max(10, popoverPos.top - (popoverPos.placement === "top" ? 20 : 0))}px`,
                      left: `${popoverPos.left}px`,
                    }}
                  >
                    <div className="vscode-sig-signature">
                      {sig.functionName}(
                      {sig.parameters.map((p, idx) => (
                        <span key={idx}>
                          <span className={idx === activeIdx ? "vscode-sig-param-active" : ""}>
                            {p.name}: {p.type}
                          </span>
                          {idx < sig.parameters.length - 1 ? ", " : ""}
                        </span>
                      ))}
                      ): {sig.returns || "void"}
                    </div>
                    {activeParam && (
                      <div className="vscode-sig-doc">
                        <strong>{activeParam.name}</strong>: {activeParam.doc}
                      </div>
                    )}
                  </div>,
                  document.body
                );
              })()}

              {/* Модальное окно быстрого перехода к файлам и строкам (Quick Open / Go to Line) */}
              {quickOpenState.isOpen && createPortal(
                <div
                  className="vscode-quick-open-overlay"
                  onMouseDown={(e) => {
                    if (e.target === e.currentTarget) handleCloseQuickOpen();
                  }}
                >
                  <div className="vscode-quick-open-modal" onMouseDown={(e) => e.stopPropagation()}>
                    <div className="vscode-quick-open-input-wrap">
                      <FileCode size={16} style={{ color: "var(--accent-blue, #3b82f6)", flexShrink: 0 }} />
                      <input
                        ref={quickOpenInputRef}
                        className="vscode-quick-open-input"
                        placeholder={
                          quickOpenState.query.startsWith(":")
                            ? "Введите номер строки для перехода (:строка[:колонка])..."
                            : "Поиск файлов по имени (или введите :строку для перехода)..."
                        }
                        value={quickOpenState.query}
                        onChange={(e) => {
                          const val = e.target.value;
                          setQuickOpenState((prev) => ({
                            ...prev,
                            query: val,
                            selectedIndex: 0,
                            mode: val.startsWith(":") ? "goto" : "files",
                          }));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") {
                            e.preventDefault();
                            handleCloseQuickOpen();
                            return;
                          }
                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setQuickOpenState((prev) => ({
                              ...prev,
                              selectedIndex: Math.min(
                                prev.selectedIndex + 1,
                                Math.max(0, quickOpenItems.length - 1)
                              ),
                            }));
                            return;
                          }
                          if (e.key === "ArrowUp") {
                            e.preventDefault();
                            setQuickOpenState((prev) => ({
                              ...prev,
                              selectedIndex: Math.max(0, prev.selectedIndex - 1),
                            }));
                            return;
                          }
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const item = quickOpenItems[quickOpenState.selectedIndex] || quickOpenItems[0];
                            if (item) {
                              handleApplyQuickOpen(item);
                            }
                            return;
                          }
                        }}
                      />
                      {quickOpenState.query && (
                        <button
                          className="vscode-icon-btn"
                          style={{ padding: 2, height: "auto" }}
                          onClick={() => setQuickOpenState((prev) => ({ ...prev, query: "", selectedIndex: 0 }))}
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>

                    <div className="vscode-quick-open-list">
                      {quickOpenItems.length === 0 ? (
                        <div style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "12px", textAlign: "center" }}>
                          Ничего не найдено
                        </div>
                      ) : (
                        quickOpenItems.map((item, idx) => {
                          const isSelected = idx === quickOpenState.selectedIndex;
                          return (
                            <div
                              key={idx}
                              className={`vscode-quick-open-item ${isSelected ? "active" : ""}`}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleApplyQuickOpen(item);
                              }}
                              onMouseEnter={() => {
                                setQuickOpenState((prev) => ({ ...prev, selectedIndex: idx }));
                              }}
                            >
                              <div className="vscode-quick-open-item-name">
                                <FileCode size={14} style={{ opacity: 0.8 }} />
                                <span>{item.type === "goto" ? item.label : item.name}</span>
                                {item.isCurrent && (
                                  <span style={{ fontSize: "10.5px", padding: "1px 5px", borderRadius: "3px", backgroundColor: "rgba(59, 130, 246, 0.2)", color: "#60a5fa" }}>
                                    текущий
                                  </span>
                                )}
                              </div>
                              {item.detail && (
                                <div className="vscode-quick-open-item-detail">
                                  {item.detail}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="vscode-quick-open-footer">
                      <span>{quickOpenState.query.startsWith(":") ? "Режим перехода к строке" : "Режим выбора файла"}</span>
                      <span>↑↓ навигация • Enter перейти • Esc закрыть</span>
                    </div>
                  </div>
                </div>,
                document.body
              )}

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

      {bottomConsole && (
        <div className="vscode-editor-bottom-console">{bottomConsole}</div>
      )}

      {/* Минималистичный статус-бар с проверкой синтаксиса и координат (всегда отображается внизу) */}
      <div className="vscode-status-bar">
        <div className="status-left">
          {!readOnly && (
            <>
              <Tooltip
                content={
                  saveStatus === "saving"
                    ? "Автосохранение в IndexedDB..."
                    : "Решение сохранено локально в IndexedDB"
                }
                side="top"
              >
                <span
                  className={`status-item save-status-indicator ${saveStatus}`}
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
                    cursor: "default",
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
              </Tooltip>
              <span className="status-sep">|</span>
            </>
          )}

          {diagnostics.errorCount > 0 ? (
            <Tooltip
              content="Обнаружена ошибка синтаксиса, типов или отсутствующий импорт"
              side="top"
            >
              <span className="status-item status-typo-warning" style={{ cursor: "default" }}>
                <AlertCircle
                  size={11}
                  style={{ color: "var(--color-error-light)" }}
                />
                <span>
                  {diagnostics.errorCount}{" "}
                  {diagnostics.errorCount === 1 ? "ошибка" : "ошибок"}
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
              <span className="status-item status-typo-ok" style={{ cursor: "default" }}>
                <CheckCircle2
                  size={11}
                  style={{ color: "var(--color-success-light)" }}
                />
                <span>Синтаксис корректен</span>
              </span>
            </Tooltip>
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
          <Tooltip content={`Язык синтаксиса: ${langInfo.name}`} side="top">
            <span
              className="status-item lang-tag"
              style={{ cursor: "default" }}
            >
              <Code2 size={11} style={{ color: langInfo.color }} />{" "}
              {langInfo.name}
            </span>
          </Tooltip>
        </div>
      </div>
      </div>
    </Tooltip.Provider>
  );
};

export default CodeEditor;
