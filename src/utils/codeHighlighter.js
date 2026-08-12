export const highlightJS = (code) => {
  if (!code) return "";

  const escapeHtml = (str) =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const rules = [
    // Block and line comments
    { type: "comment", regex: /^(\/\*[\s\S]*?\*\/|\/\/.*)/ },
    // Template literals with interpolation — match the whole template
    {
      type: "template",
      regex: /^`(?:[^`\\]|\\.|\$\{[^}]*\})*`/,
    },
    // Strings (double and single quotes)
    {
      type: "string",
      regex: /^("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/,
    },
    // Regex literal: /pattern/flags — must come before number and operator rules.
    // Only matched when context indicates a regex is valid (not division).
    // Handled via contextual check in the main loop below.
    {
      type: "regex",
      regex: /^\/(?![*/])(?:\\.|\[(?:\\.|[^\]\\])*\]|[^/\\\n])+\/[gimsuy]*/,
    },
    // Numbers (including decimals)
    { type: "number", regex: /^\b\d+(?:\.\d+)?\b/ },
    // JSX tag punctuation: </  />  <  >
    { type: "jsx-tag-close", regex: /^<\// },
    { type: "jsx-tag-self-close", regex: /^\/>/  },
    { type: "jsx-tag-open", regex: /^<(?=[a-zA-Z])/ },
    { type: "jsx-tag-end", regex: /^>/ },
    // Arrow operator (must come before generic operator rule)
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
        /^\b(const|let|var|function|return|import|export|default|try|catch|finally|async|await|if|else|for|while|do|switch|case|break|continue|throw|new|typeof|instanceof|void|delete|in|of|from|as|type|interface|extends|implements|readonly|public|private|protected|class|static|super|yield|enum|namespace|declare|abstract|satisfies)(?![a-zA-Z0-9_$])/,
    },
    // Boolean and special values
    {
      type: "boolean",
      regex: /^\b(true|false|this|self)(?![a-zA-Z0-9_$])/,
    },
    // Null-ish types
    {
      type: "type",
      regex:
        /^\b(string|number|boolean|null|undefined|any|unknown|never|object|symbol|bigint|void)(?![a-zA-Z0-9_$])/,
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
    // Function call: identifier immediately followed by (
    {
      type: "function-call",
      regex: /^([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/,
    },
    // Property access after dot: .identifier
    {
      type: "property",
      regex: /^(\.)([a-zA-Z_$][a-zA-Z0-9_$]*)/,
    },
    // Generic identifier
    { type: "ident", regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*/ },
    // Single punctuation character (NOT greedy)
    { type: "punct", regex: /^[^\s\w]/ },
    // Whitespace
    { type: "space", regex: /^(\s+)/ },
  ];

  // Token types after which a `/` should be treated as regex start (not division)
  const REGEX_PRECEDING_TOKENS = new Set([
    "", // start of input
    "keyword", "operator", "arrow", "comment", "punct",
    "jsx-tag-open", "jsx-tag-close", "jsx-tag-end", "jsx-tag-self-close",
  ]);

  let html = "";
  let rest = code;
  let insideJsxTag = false;
  let lastTokenType = "";

  while (rest.length > 0) {
    let matched = false;

    for (const rule of rules) {
      // Skip regex rule when context indicates division, not a regex literal
      if (rule.type === "regex" && !REGEX_PRECEDING_TOKENS.has(lastTokenType)) {
        continue;
      }
      const m = rule.regex.exec(rest);
      if (m) {
        matched = true;
        const text = m[0];
        rest = rest.slice(text.length);

        if (rule.type === "comment") {
          html +=
            '<span class="hl-cm">' +
            escapeHtml(text) +
            "</span>";
        } else if (rule.type === "template") {
          html += highlightTemplateLiteral(text, escapeHtml);
        } else if (rule.type === "string") {
          html +=
            '<span class="hl-str">' + escapeHtml(text) + "</span>";
        } else if (rule.type === "regex") {
          html +=
            '<span class="hl-regex">' + escapeHtml(text) + "</span>";
        } else if (rule.type === "number") {
          html +=
            '<span class="hl-num">' + escapeHtml(text) + "</span>";
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
          html +=
            '<span class="hl-arrow">=&gt;</span>';
        } else if (rule.type === "operator") {
          html +=
            '<span class="hl-op">' + escapeHtml(text) + "</span>";
        } else if (rule.type === "keyword") {
          html +=
            '<span class="hl-kw">' +
            escapeHtml(text) +
            "</span>";
        } else if (rule.type === "boolean") {
          html +=
            '<span class="hl-bool">' +
            escapeHtml(text) +
            "</span>";
        } else if (rule.type === "type") {
          html +=
            '<span class="hl-type">' +
            escapeHtml(text) +
            "</span>";
        } else if (rule.type === "react-hook") {
          html +=
            '<span class="hl-hook">' +
            escapeHtml(text) +
            "</span>";
        } else if (rule.type === "global") {
          html +=
            '<span class="hl-global">' + escapeHtml(text) + "</span>";
        } else if (rule.type === "function-call") {
          html +=
            '<span class="hl-fn">' + escapeHtml(text) + "</span>";
        } else if (rule.type === "property") {
          const dot = m[1];
          const prop = m[2];
          html +=
            '<span class="hl-punct">' +
            escapeHtml(dot) +
            "</span>" +
            '<span class="hl-prop">' +
            escapeHtml(prop) +
            "</span>";
        } else if (rule.type === "ident") {
          if (insideJsxTag && lastTokenType !== "punct") {
            if (
              lastTokenType === "jsx-tag-open" ||
              lastTokenType === "jsx-tag-close"
            ) {
              html +=
                '<span class="hl-tag">' +
                escapeHtml(text) +
                "</span>";
            } else {
              html +=
                '<span class="hl-attr">' +
                escapeHtml(text) +
                "</span>";
            }
          } else {
            html += escapeHtml(text);
          }
        } else if (rule.type === "punct") {
          if ("{}()[]".includes(text)) {
            html +=
              '<span class="hl-punct">' +
              escapeHtml(text) +
              "</span>";
          } else if (text === "=" && !insideJsxTag) {
            html +=
              '<span class="hl-op">' +
              escapeHtml(text) +
              "</span>";
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
      html += escapeHtml(rest[0]);
      rest = rest.slice(1);
    }
  }

  return html;
};

export const highlightTemplateLiteral = (text, escapeHtml) => {
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
        highlightJS(inner) +
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
