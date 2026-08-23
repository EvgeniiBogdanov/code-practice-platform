/**
 * Code Highlighter Engine
 * Syntax highlighting for JavaScript, JSX, TypeScript, TSX in VS Code style.
 */

import { findMatchingBracketPair } from "./bracketMatcher";

export interface DiagnosticProblem {
  line: number;
  col: number;
  message: string;
  severity: "error" | "warning" | "info";
  symbol?: string;
  typo?: string;
}

export interface HighlightOptions {
  highlightWord?: string;
  bracketPair?: [number, number] | null;
  problems?: DiagnosticProblem[];
  unusedImports?: Set<string> | null;
}

export { findMatchingBracketPair };

const escapeHtml = (str: string): string =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function highlightTemplateLiteral(text: string, options: HighlightOptions = {}): string {
  let result = "";
  let i = 0;
  result += '<span class="hl-str">`</span>';
  i++;

  while (i < text.length - 1) {
    if (text[i] === "\\" && i + 1 < text.length - 1) {
      result += `<span class="hl-str">${escapeHtml(text[i] + text[i + 1])}</span>`;
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
      result += `<span class="hl-op">\${</span>${highlightJS(inner, options)}<span class="hl-op">}</span>`;
      i = j;
    } else {
      result += `<span class="hl-str">${escapeHtml(text[i])}</span>`;
      i++;
    }
  }

  result += '<span class="hl-str">`</span>';
  return result;
}

export function highlightJS(code: string, options: HighlightOptions = {}): string {
  if (!code) return "";

  const { highlightWord = "", bracketPair = null, problems = [], unusedImports = null } = options;

  const isWordMatch = (txt: string) =>
    Boolean(highlightWord && highlightWord.length >= 2 && txt === highlightWord);
  const isBracketMatch = (idx: number) =>
    Boolean(bracketPair && (idx === bracketPair[0] || idx === bracketPair[1]));

  const rules = [
    { type: "comment", regex: /^(\/\*[\s\S]*?\*\/|\/\/.*)/ },
    { type: "template", regex: /^`(?:[^`\\]|\\.|\$\{[^}]*\})*`/ },
    { type: "string", regex: /^("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/ },
    { type: "regex", regex: /^\/(?![*/])(?:\\.|\[(?:\\.|[^\]\\])*\]|[^/\\\n])+\/[gimsuy]*/ },
    { type: "number", regex: /^\b\d+(?:\.\d+)?\b/ },
    { type: "jsx-tag-close", regex: /^<\// },
    { type: "jsx-tag-self-close", regex: /^\/>/ },
    { type: "jsx-tag-open", regex: /^<(?=[a-zA-Z])/ },
    { type: "jsx-tag-end", regex: /^>/ },
    { type: "arrow", regex: /^=>/ },
    { type: "operator", regex: /^\.{3}/ },
    { type: "operator", regex: /^(===|!==|==|!=|<=|>=|&&|\|\||[+\-*/%]=?|!)/ },
    { type: "operator", regex: /^\?\.\B/ },
    {
      type: "keyword",
      regex:
        /^\b(const|let|var|function|return|import|export|default|try|catch|finally|async|await|if|else|for|while|do|switch|case|break|continue|throw|new|typeof|instanceof|void|delete|in|of|from|as|type|interface|extends|implements|readonly|public|private|protected|class|static|super|yield|enum|namespace|declare|abstract|satisfies|is|keyof|infer|asserts)(?![a-zA-Z0-9_$])/,
    },
    { type: "boolean", regex: /^\b(true|false|this|self)(?![a-zA-Z0-9_$])/ },
    {
      type: "type",
      regex:
        /^\b(string|number|boolean|null|undefined|any|unknown|never|object|symbol|bigint|void|ReactNode|ReactElement|ReactPortal|FC|FunctionComponent|PropsWithChildren|ChangeEvent|MouseEvent|KeyboardEvent|FormEvent|FocusEvent|PointerEvent|TouchEvent|SyntheticEvent|ComponentPropsWithoutRef|ComponentPropsWithRef|ComponentProps|ElementRef|ElementType|MutableRefObject|RefObject|ForwardedRef|Ref|Dispatch|SetStateAction|Reducer|ReducerState|ReducerAction|Context|Key|CSSProperties|HTMLInputElement|HTMLButtonElement|HTMLSelectElement|HTMLTextAreaElement|HTMLFormElement|HTMLAnchorElement|HTMLDivElement|HTMLSpanElement|HTMLImageElement|HTMLElement|Element|Event|Node|Partial|Required|Readonly|Record|Pick|Omit|Exclude|Extract|NonNullable|ReturnType|Parameters|InstanceType|Awaited|Promise)(?![a-zA-Z0-9_$])/,
    },
    {
      type: "react-hook",
      regex:
        /^\b(useState|useEffect|useCallback|useMemo|useRef|useReducer|useContext|useImperativeHandle|useLayoutEffect|useDebugValue|useDeferredValue|useTransition|useId|useSyncExternalStore|useInsertionEffect|memo|forwardRef|createPortal|useNavigate|useParams|useLocation|createContext|createSelector|createSlice|createAsyncThunk|configureStore|useSelector|useDispatch)(?![a-zA-Z0-9_$])/,
    },
    {
      type: "global",
      regex:
        /^\b(fetch|console|window|document|URL|setTimeout|clearTimeout|setInterval|clearInterval|Math|Date|Array|Object|String|Number|Boolean|Promise|Error|JSON|Map|Set|WeakMap|WeakSet|Symbol|Proxy|Reflect|RegExp|parseInt|parseFloat|isNaN|isFinite|encodeURIComponent|decodeURIComponent|alert|confirm|prompt|localStorage|sessionStorage|navigator|location|history|performance|AbortController|FormData|Headers|Request|Response|ReadableStream|WritableStream|TextEncoder|TextDecoder|Blob|File|FileReader|XMLHttpRequest|WebSocket|Worker|SharedWorker|IntersectionObserver|MutationObserver|ResizeObserver|requestAnimationFrame|cancelAnimationFrame|queueMicrotask|structuredClone)(?![a-zA-Z0-9_$])/,
    },
    { type: "function-call", regex: /^([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/ },
    { type: "property", regex: /^(\.)([a-zA-Z_$][a-zA-Z0-9_$]*)/ },
    { type: "ident", regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*/ },
    { type: "punct", regex: /^[^\s\w]/ },
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

        const newlines = text.split("\n").length - 1;
        if (newlines > 0) {
          currentLine += newlines;
          const lastNl = text.lastIndexOf("\n");
          currentCol = text.length - lastNl;
        } else {
          currentCol += text.length;
        }

        const wordClass = isWordMatch(text) ? " hl-word-match" : "";

        let squigglyClass = "";
        if (problems && problems.length > 0 && rule.type !== "space" && rule.type !== "comment") {
          const prob = problems.find((p) => {
            if (p.line !== tokenLine) return false;
            if (p.typo && p.typo === text) return true;
            if (p.symbol && p.symbol === text) return true;
            if (tokenCol >= p.col && tokenCol < p.col + (p.symbol?.length || p.typo?.length || 5))
              return true;
            if (p.col >= tokenCol && p.col < tokenCol + tokenLen) return true;
            return false;
          });
          if (prob) {
            squigglyClass =
              prob.severity === "warning" ? " hl-squiggly-warning" : " hl-squiggly-error";
          }
        }

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
          html += '<span class="hl-cm">' + escapeHtml(text) + "</span>";
        } else if (rule.type === "template") {
          html += highlightTemplateLiteral(text, options);
        } else if (rule.type === "string") {
          html += '<span class="hl-str' + squigglyClass + '">' + escapeHtml(text) + "</span>";
        } else if (rule.type === "regex") {
          html += '<span class="hl-regex">' + escapeHtml(text) + "</span>";
        } else if (rule.type === "number") {
          html += '<span class="hl-num' + extraClasses + '">' + escapeHtml(text) + "</span>";
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
          html += '<span class="hl-op">' + escapeHtml(text) + "</span>";
        } else if (rule.type === "keyword") {
          html += '<span class="hl-kw' + extraClasses + '">' + escapeHtml(text) + "</span>";
        } else if (rule.type === "boolean") {
          html += '<span class="hl-bool' + extraClasses + '">' + escapeHtml(text) + "</span>";
        } else if (rule.type === "type") {
          html += '<span class="hl-type' + extraClasses + '">' + escapeHtml(text) + "</span>";
        } else if (rule.type === "react-hook") {
          html += '<span class="hl-hook' + extraClasses + '">' + escapeHtml(text) + "</span>";
        } else if (rule.type === "global") {
          html += '<span class="hl-global' + extraClasses + '">' + escapeHtml(text) + "</span>";
        } else if (rule.type === "function-call") {
          html += '<span class="hl-fn' + extraClasses + '">' + escapeHtml(text) + "</span>";
        } else if (rule.type === "property") {
          const dot = m[1];
          const prop = m[2];
          const propExtraClasses = (isWordMatch(prop) ? " hl-word-match" : "") + squigglyClass;
          html +=
            '<span class="hl-punct">' +
            escapeHtml(dot) +
            "</span>" +
            '<span class="hl-prop' +
            propExtraClasses +
            '">' +
            escapeHtml(prop) +
            "</span>";
        } else if (rule.type === "ident") {
          if (insideJsxTag && lastTokenType !== "punct") {
            if (lastTokenType === "jsx-tag-open" || lastTokenType === "jsx-tag-close") {
              html += '<span class="hl-tag' + extraClasses + '">' + escapeHtml(text) + "</span>";
            } else {
              html += '<span class="hl-attr' + extraClasses + '">' + escapeHtml(text) + "</span>";
            }
          } else {
            if (extraClasses) {
              html += '<span class="' + extraClasses.trim() + '">' + escapeHtml(text) + "</span>";
            } else {
              html += escapeHtml(text);
            }
          }
        } else if (rule.type === "punct") {
          const bracketClass = isBracketMatch(tokenStart) ? " hl-bracket-match" : "";
          if ("{}()[]".includes(text)) {
            html +=
              '<span class="hl-punct' +
              bracketClass +
              squigglyClass +
              '">' +
              escapeHtml(text) +
              "</span>";
          } else if (text === "=" && !insideJsxTag) {
            html += '<span class="hl-op">' + escapeHtml(text) + "</span>";
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
        html += "<span" + bracketClass + ">" + escapeHtml(rest[0]) + "</span>";
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
}
