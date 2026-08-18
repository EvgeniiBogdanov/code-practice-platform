/**
 * codeHighlighter.js
 * Высокопроизводительный движок подсветки синтаксиса JavaScript / JSX / TSX
 * Поддерживает стили VS Code, подсветку вхождений слов (Word Highlight), парных скобок (Bracket Match),
 * волнистые линии ошибок (Squiggly Underlines) и приглушение неиспользуемых импортов (Unused Dimming).
 */

/**
 * Находит пару скобок (открывающая + закрывающая) для позиции курсора
 * @param {string} code Исходный код
 * @param {number} cursorIndex Позиция курсора
 * @returns {[number, number] | null} Индексы открывающей и закрывающей скобок
 */
export const findMatchingBracketPair = (code, cursorIndex) => {
  if (!code || typeof code !== "string" || cursorIndex < 0 || cursorIndex > code.length) {
    return null;
  }

  const brackets = { "(": ")", "{": "}", "[": "]" };
  const closingBrackets = { ")": "(", "}": "{", "]": "[" };

  let targetIdx = -1;
  let isOpening = false;
  let openChar = "";
  let closeChar = "";

  const charUnder = code[cursorIndex];
  const charBefore = cursorIndex > 0 ? code[cursorIndex - 1] : "";

  if (brackets[charUnder]) {
    targetIdx = cursorIndex;
    isOpening = true;
    openChar = charUnder;
    closeChar = brackets[charUnder];
  } else if (closingBrackets[charUnder]) {
    targetIdx = cursorIndex;
    isOpening = false;
    closeChar = charUnder;
    openChar = closingBrackets[charUnder];
  } else if (brackets[charBefore]) {
    targetIdx = cursorIndex - 1;
    isOpening = true;
    openChar = charBefore;
    closeChar = brackets[charBefore];
  } else if (closingBrackets[charBefore]) {
    targetIdx = cursorIndex - 1;
    isOpening = false;
    closeChar = charBefore;
    openChar = closingBrackets[charBefore];
  }

  if (targetIdx === -1) return null;

  if (isOpening) {
    let depth = 1;
    let inString = null;
    for (let i = targetIdx + 1; i < code.length; i++) {
      const ch = code[i];
      if (inString) {
        if (ch === "\\" && i + 1 < code.length) {
          i++;
        } else if (ch === inString) {
          inString = null;
        }
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        inString = ch;
        continue;
      }
      if (ch === openChar) depth++;
      else if (ch === closeChar) {
        depth--;
        if (depth === 0) {
          return [targetIdx, i];
        }
      }
    }
  } else {
    let depth = 1;
    let inString = null;
    for (let i = targetIdx - 1; i >= 0; i--) {
      const ch = code[i];
      if (inString) {
        if (ch === "\\" && i > 0 && code[i - 1] === "\\") {
          // ignore
        } else if (ch === inString) {
          inString = null;
        }
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        inString = ch;
        continue;
      }
      if (ch === closeChar) depth++;
      else if (ch === openChar) {
        depth--;
        if (depth === 0) {
          return [i, targetIdx];
        }
      }
    }
  }

  return null;
};

/**
 * Подсветка синтаксиса JavaScript / JSX / TSX в стиле VS Code
 * @param {string} code Исходный код
 * @param {object} [options] Опции подсветки
 * @param {string} [options.highlightWord] Идентификатор под курсором для подсветки всех вхождений
 * @param {[number, number]} [options.bracketPair] Индексы парных скобок для подсветки
 * @param {Array} [options.problems] Список диагностических проблем (ошибки/предупреждения) для волнистых подчеркиваний
 * @param {Set<string>} [options.unusedImports] Список неиспользуемых импортов для приглушения
 * @returns {string} HTML-разметка с подсветкой синтаксиса
 */
export const highlightJS = (code, options = {}) => {
  if (!code) return "";

  const {
    highlightWord = "",
    bracketPair = null,
    problems = [],
    unusedImports = null,
  } = options;

  const isWordMatch = (txt) => Boolean(highlightWord && highlightWord.length >= 2 && txt === highlightWord);
  const isBracketMatch = (idx) => Boolean(bracketPair && (idx === bracketPair[0] || idx === bracketPair[1]));

  const escapeHtml = (str) =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const rules = [
    // Block and line comments
    { type: "comment", regex: /^(\/\*[\s\S]*?\*\/|\/\/.*)/ },
    // Template literals with interpolation
    {
      type: "template",
      regex: /^`(?:[^`\\]|\\.|\$\{[^}]*\})*`/,
    },
    // Strings (double and single quotes)
    {
      type: "string",
      regex: /^("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/,
    },
    // Regex literal
    {
      type: "regex",
      regex: /^\/(?![*/])(?:\\.|\[(?:\\.|[^\]\\])*\]|[^/\\\n])+\/[gimsuy]*/,
    },
    // Numbers (including decimals)
    { type: "number", regex: /^\b\d+(?:\.\d+)?\b/ },
    // JSX tag punctuation: </  />  <  >
    { type: "jsx-tag-close", regex: /^<\// },
    { type: "jsx-tag-self-close", regex: /^\/>/ },
    { type: "jsx-tag-open", regex: /^<(?=[a-zA-Z])/ },
    { type: "jsx-tag-end", regex: /^>/ },
    // Arrow operator
    { type: "arrow", regex: /^=>/ },
    // Spread/rest operator
    { type: "operator", regex: /^\.{3}/ },
    // Comparison and logical operators
    {
      type: "operator",
      regex: /^(===|!==|==|!=|<=|>=|&&|\|\||[+\-*/%]=?|!)/,
    },
    // Optional chaining
    { type: "operator", regex: /^\?\.\B/ },
    // Keywords
    {
      type: "keyword",
      regex:
        /^\b(const|let|var|function|return|import|export|default|try|catch|finally|async|await|if|else|for|while|do|switch|case|break|continue|throw|new|typeof|instanceof|void|delete|in|of|from|as|type|interface|extends|implements|readonly|public|private|protected|class|static|super|yield|enum|namespace|declare|abstract|satisfies|is|keyof|infer|asserts)(?![a-zA-Z0-9_$])/,
    },
    // Boolean and special values
    {
      type: "boolean",
      regex: /^\b(true|false|this|self)(?![a-zA-Z0-9_$])/,
    },
    // Null-ish & TypeScript / React / DOM types
    {
      type: "type",
      regex:
        /^\b(string|number|boolean|null|undefined|any|unknown|never|object|symbol|bigint|void|ReactNode|ReactElement|ReactPortal|FC|FunctionComponent|PropsWithChildren|ChangeEvent|MouseEvent|KeyboardEvent|FormEvent|FocusEvent|PointerEvent|TouchEvent|SyntheticEvent|ComponentPropsWithoutRef|ComponentPropsWithRef|ComponentProps|ElementRef|ElementType|MutableRefObject|RefObject|ForwardedRef|Ref|Dispatch|SetStateAction|Reducer|ReducerState|ReducerAction|Context|Key|CSSProperties|HTMLInputElement|HTMLButtonElement|HTMLSelectElement|HTMLTextAreaElement|HTMLFormElement|HTMLAnchorElement|HTMLDivElement|HTMLSpanElement|HTMLImageElement|HTMLElement|Element|Event|Node|Partial|Required|Readonly|Record|Pick|Omit|Exclude|Extract|NonNullable|ReturnType|Parameters|InstanceType|Awaited|Promise)(?![a-zA-Z0-9_$])/,
    },
    // React hooks and API
    {
      type: "react-hook",
      regex:
        /^\b(useState|useEffect|useCallback|useMemo|useRef|useReducer|useContext|useImperativeHandle|useLayoutEffect|useDebugValue|useDeferredValue|useTransition|useId|useSyncExternalStore|useInsertionEffect|memo|forwardRef|createPortal|useNavigate|useParams|useLocation|createContext|createSelector|createSlice|createAsyncThunk|configureStore|useSelector|useDispatch)(?![a-zA-Z0-9_$])/,
    },
    // Well-known globals and built-in methods
    {
      type: "global",
      regex:
        /^\b(fetch|console|window|document|URL|setTimeout|clearTimeout|setInterval|clearInterval|Math|Date|Array|Object|String|Number|Boolean|Promise|Error|JSON|Map|Set|WeakMap|WeakSet|Symbol|Proxy|Reflect|RegExp|parseInt|parseFloat|isNaN|isFinite|encodeURIComponent|decodeURIComponent|alert|confirm|prompt|localStorage|sessionStorage|navigator|location|history|performance|AbortController|FormData|Headers|Request|Response|ReadableStream|WritableStream|TextEncoder|TextDecoder|Blob|File|FileReader|XMLHttpRequest|WebSocket|Worker|SharedWorker|IntersectionObserver|MutationObserver|ResizeObserver|requestAnimationFrame|cancelAnimationFrame|queueMicrotask|structuredClone)(?![a-zA-Z0-9_$])/,
    },
    // Function call
    {
      type: "function-call",
      regex: /^([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/,
    },
    // Property access after dot
    {
      type: "property",
      regex: /^(\.)([a-zA-Z_$][a-zA-Z0-9_$]*)/,
    },
    // Generic identifier
    { type: "ident", regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*/ },
    // Single punctuation character
    { type: "punct", regex: /^[^\s\w]/ },
    // Whitespace
    { type: "space", regex: /^(\s+)/ },
  ];

  const REGEX_PRECEDING_TOKENS = new Set([
    "",
    "keyword",
    "operator",
    "arrow",
    "comment",
    "punct",
    "jsx-tag-open",
    "jsx-tag-close",
    "jsx-tag-end",
    "jsx-tag-self-close",
  ]);

  let html = "";
  let rest = code;
  let insideJsxTag = false;
  let insideImport = false;
  let lastTokenType = "";
  let currentIndex = 0;
  let currentLine = 1;
  let currentCol = 1;

  while (rest.length > 0) {
    let matched = false;

    for (const rule of rules) {
      if (rule.type === "regex" && !REGEX_PRECEDING_TOKENS.has(lastTokenType)) {
        continue;
      }
      const m = rule.regex.exec(rest);
      if (m) {
        matched = true;
        const text = m[0];
        const tokenStart = currentIndex;
        const tokenLine = currentLine;
        const tokenCol = currentCol;
        const tokenLen = text.length;

        rest = rest.slice(text.length);
        currentIndex += text.length;

        // Обновляем текущую строку и колонку
        const newlines = text.split("\n").length - 1;
        if (newlines > 0) {
          currentLine += newlines;
          const lastNl = text.lastIndexOf("\n");
          currentCol = text.length - lastNl;
        } else {
          currentCol += text.length;
        }

        // 1. Подсветка совпадений активного слова
        const wordClass = isWordMatch(text) ? " hl-word-match" : "";

        // 2. Волнистая линия ошибки или предупреждения (Squiggly Underline)
        let squigglyClass = "";
        if (problems && problems.length > 0 && rule.type !== "space" && rule.type !== "comment") {
          const prob = problems.find((p) => {
            if (p.line !== tokenLine) return false;
            if (p.typo && p.typo === text) return true;
            if (p.symbol && p.symbol === text) return true;
            if (tokenCol >= p.col && tokenCol < p.col + (p.symbol?.length || p.typo?.length || 5)) return true;
            if (p.col >= tokenCol && p.col < tokenCol + tokenLen) return true;
            return false;
          });
          if (prob) {
            squigglyClass = prob.severity === "warning" ? " hl-squiggly-warning" : " hl-squiggly-error";
          }
        }

        // 3. Отслеживание импортов для приглушения неиспользуемых символов (Unused Dimming)
        if (rule.type === "keyword" && text === "import") {
          insideImport = true;
        } else if (insideImport && (text === ";" || rule.type === "string" || newlines > 0)) {
          if (text === ";" || rule.type === "string") {
            insideImport = false;
          }
        }

        let unusedClass = "";
        if (insideImport && unusedImports && unusedImports.size > 0 && unusedImports.has(text)) {
          unusedClass = " hl-unused-dimmed";
        }

        const extraClasses = wordClass + squigglyClass + unusedClass;

        if (rule.type === "comment") {
          html += '<span class="hl-cm">' + escapeHtml(text) + '</span>';
        } else if (rule.type === "template") {
          html += highlightTemplateLiteral(text, escapeHtml, options);
        } else if (rule.type === "string") {
          html += '<span class="hl-str' + squigglyClass + '">' + escapeHtml(text) + '</span>';
        } else if (rule.type === "regex") {
          html += '<span class="hl-regex">' + escapeHtml(text) + '</span>';
        } else if (rule.type === "number") {
          html += '<span class="hl-num' + extraClasses + '">' + escapeHtml(text) + '</span>';
        } else if (rule.type === "jsx-tag-open") {
          insideJsxTag = true;
          html += '<span class="hl-tag-punct">&lt;</span>';
        } else if (rule.type === "jsx-tag-close") {
          insideJsxTag = true;
          html += '<span class="hl-tag-punct">&lt;/</span>';
        } else if (rule.type === "jsx-tag-self-close") {
          insideJsxTag = false;
          html += '<span class="hl-tag-punct">/&gt;</span>';
        } else if (rule.type === "jsx-tag-end") {
          insideJsxTag = false;
          html += '<span class="hl-tag-punct">&gt;</span>';
        } else if (rule.type === "arrow") {
          html += '<span class="hl-arrow">=&gt;</span>';
        } else if (rule.type === "operator") {
          html += '<span class="hl-op">' + escapeHtml(text) + '</span>';
        } else if (rule.type === "keyword") {
          html += '<span class="hl-kw' + extraClasses + '">' + escapeHtml(text) + '</span>';
        } else if (rule.type === "boolean") {
          html += '<span class="hl-bool' + extraClasses + '">' + escapeHtml(text) + '</span>';
        } else if (rule.type === "type") {
          html += '<span class="hl-type' + extraClasses + '">' + escapeHtml(text) + '</span>';
        } else if (rule.type === "react-hook") {
          html += '<span class="hl-hook' + extraClasses + '">' + escapeHtml(text) + '</span>';
        } else if (rule.type === "global") {
          html += '<span class="hl-global' + extraClasses + '">' + escapeHtml(text) + '</span>';
        } else if (rule.type === "function-call") {
          html += '<span class="hl-fn' + extraClasses + '">' + escapeHtml(text) + '</span>';
        } else if (rule.type === "property") {
          const dot = m[1];
          const prop = m[2];
          const propExtraClasses = (isWordMatch(prop) ? " hl-word-match" : "") + squigglyClass;
          html +=
            '<span class="hl-punct">' +
            escapeHtml(dot) +
            '</span>' +
            '<span class="hl-prop' + propExtraClasses + '">' +
            escapeHtml(prop) +
            '</span>';
        } else if (rule.type === "ident") {
          if (insideJsxTag && lastTokenType !== "punct") {
            if (
              lastTokenType === "jsx-tag-open" ||
              lastTokenType === "jsx-tag-close"
            ) {
              html += '<span class="hl-tag' + extraClasses + '">' + escapeHtml(text) + '</span>';
            } else {
              html += '<span class="hl-attr' + extraClasses + '">' + escapeHtml(text) + '</span>';
            }
          } else {
            if (extraClasses) {
              html += '<span class="' + extraClasses.trim() + '">' + escapeHtml(text) + '</span>';
            } else {
              html += escapeHtml(text);
            }
          }
        } else if (rule.type === "punct") {
          const bracketClass = isBracketMatch(tokenStart) ? " hl-bracket-match" : "";
          if ("{}()[]".includes(text)) {
            html += '<span class="hl-punct' + bracketClass + squigglyClass + '">' + escapeHtml(text) + '</span>';
          } else if (text === "=" && !insideJsxTag) {
            html += '<span class="hl-op">' + escapeHtml(text) + '</span>';
          } else {
            html += escapeHtml(text);
          }
        } else {
          html += escapeHtml(text);
        }

        if (rule.type !== "space") {
          lastTokenType = rule.type;
        }
        break;
      }
    }

    if (!matched) {
      const charStart = currentIndex;
      const bracketClass = isBracketMatch(charStart) ? ' class="hl-bracket-match"' : "";
      if (bracketClass) {
        html += '<span' + bracketClass + '>' + escapeHtml(rest[0]) + '</span>';
      } else {
        html += escapeHtml(rest[0]);
      }
      currentIndex += 1;
      if (rest[0] === "\n") {
        currentLine += 1;
        currentCol = 1;
      } else {
        currentCol += 1;
      }
      rest = rest.slice(1);
    }
  }

  return html;
};

export const highlightTemplateLiteral = (text, escapeHtml, options = {}) => {
  let result = "";
  let i = 0;
  result += '<span class="hl-str">`</span>';
  i++;

  while (i < text.length - 1) {
    if (text[i] === "\\" && i + 1 < text.length - 1) {
      result +=
        '<span class="hl-str">' +
        escapeHtml(text[i] + text[i + 1]) +
        "</span>";
      i += 2;
    } else if (text[i] === "$" && text[i + 1] === "{") {
      let depth = 1;
      let j = i + 2;
      while (j < text.length - 1 && depth > 0) {
        if (text[j] === "{") depth++;
        if (text[j] === "}") depth--;
        j++;
      }
      const inner = text.slice(i + 2, j - 1);
      result +=
        '<span class="hl-op">${</span>' +
        highlightJS(inner, options) +
        '<span class="hl-op">}</span>';
      i = j;
    } else {
      result +=
        '<span class="hl-str">' + escapeHtml(text[i]) + "</span>";
      i++;
    }
  }

  result += '<span class="hl-str">`</span>';
  return result;
};
