/**
 * Token rules shared by the JavaScript/TypeScript highlighter.
 */

const JS_KEYWORDS =
  "const|let|var|function|return|import|export|default|try|catch|finally|async|await|if|else|for|while|do|switch|case|break|continue|throw|new|typeof|instanceof|void|delete|in|of|from|as|class|extends|static|super|yield|get|set";
const TS_KEYWORDS =
  "type|interface|implements|readonly|public|private|protected|enum|namespace|declare|abstract|satisfies|is|keyof|infer|asserts|unique|override|accessor";
/** Words that are keywords only by position: `const type = 1` declares a variable. */
export const CONTEXTUAL_KEYWORDS = new Set([
  "type",
  "is",
  "keyof",
  "infer",
  "asserts",
  "satisfies",
  "declare",
  "namespace",
  "abstract",
  "readonly",
  "unique",
  "override",
  "as",
  "from",
  "of",
  "async",
]);
/** Words that are keywords only before a member name: `get x() {}` but `get(url)`. */
export const ACCESSOR_KEYWORDS = new Set(["get", "set", "accessor"]);
export const FOLLOWED_BY_MEMBER_NAME = /^\s+[#\w$[]/;
/** The word is followed by something that cannot continue a declaration or `as`/`of` clause. */
export const USED_AS_IDENTIFIER = /^\s*(?:[=:,;)\]}+\-%?&|^~<>!]|\.(?!\.)|$)/;
/** Names that are declared, not typed: `const object = {}`. */
export const DECLARATION_KEYWORDS = new Set([
  "const",
  "let",
  "var",
  "function",
  "class",
  "enum",
  "interface",
  "type",
  "namespace",
]);
/** `<T,>`, `<const T,>`, `<T = any>` or `<T extends X>` start a generic arrow, not markup. */
export const GENERIC_PARAMS_START = /^<(?:const\s+)?[\w$]+\s*(?:,|=(?!>)|extends\b)/;

interface HighlightRule {
  type: string;
  regex: RegExp;
}

const createRules = (supportsTypeScript: boolean): HighlightRule[] => [
  // Unterminated comments run to the end of the file, as in VS Code.
  { type: "comment", regex: /\/\*[\s\S]*?(?:\*\/|$)|\/\/.*/y },
  { type: "string", regex: /"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?/y },
  { type: "regex", regex: /\/(?![*/])(?:\\.|\[(?:\\.|[^\]\\])*\]|[^/\\\n])+\/[dgimsuyv]*/y },
  {
    type: "number",
    regex:
      /(?:0[xX][\da-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|(?:\d[\d_]*)?\.?\d[\d_]*(?:[eE][+-]?\d+)?)n?\b/y,
  },
  { type: "jsx-tag-close", regex: /<\//y },
  { type: "jsx-tag-self-close", regex: /\/>/y },
  { type: "jsx-tag-open", regex: /<(?=[a-zA-Z>])/y },
  { type: "jsx-tag-end", regex: />/y },
  { type: "arrow", regex: /=>/y },
  { type: "operator", regex: /\.{3}/y },
  // `a++ / 2`: the postfix operator ends a value, so the slash divides.
  { type: "update", regex: /\+\+|--/y },
  { type: "operator", regex: /===|!==|==|!=|<=|>=|&&|\|\||\?\?=?|[+\-*/%]=?|!/y },
  { type: "operator", regex: /\?\.(?!\d)/y },
  {
    type: "keyword",
    regex: new RegExp(
      `\\b(?:${supportsTypeScript ? `${JS_KEYWORDS}|${TS_KEYWORDS}` : JS_KEYWORDS})(?![\\w$])`,
      "y"
    ),
  },
  { type: "boolean", regex: /\b(?:true|false|this|null|undefined)(?![\w$])/y },
  { type: "decorator", regex: /@[a-zA-Z_$][\w$.]*/y },
  { type: "private-name", regex: /#[a-zA-Z_$][\w$]*/y },
  {
    type: supportsTypeScript ? "type" : "disabled",
    regex:
      /\b(?:string|number|boolean|any|unknown|never|object|symbol|bigint|ReactNode|ReactElement|ReactPortal|FC|FunctionComponent|PropsWithChildren|ChangeEvent|MouseEvent|KeyboardEvent|FormEvent|FocusEvent|PointerEvent|TouchEvent|SyntheticEvent|ComponentPropsWithoutRef|ComponentPropsWithRef|ComponentProps|ElementRef|ElementType|MutableRefObject|RefObject|ForwardedRef|Ref|Dispatch|SetStateAction|Reducer|ReducerState|ReducerAction|Context|Key|CSSProperties|HTMLInputElement|HTMLButtonElement|HTMLSelectElement|HTMLTextAreaElement|HTMLFormElement|HTMLAnchorElement|HTMLDivElement|HTMLSpanElement|HTMLImageElement|HTMLElement|Partial|Required|Readonly|Record|Pick|Omit|Exclude|Extract|NonNullable|ReturnType|Parameters|InstanceType|Awaited)(?![\w$])/y,
  },
  {
    type: "react-hook",
    regex:
      /\b(?:useState|useEffect|useCallback|useMemo|useRef|useReducer|useContext|useImperativeHandle|useLayoutEffect|useDebugValue|useDeferredValue|useTransition|useActionState|useOptimistic|useId|useSyncExternalStore|useInsertionEffect|memo|forwardRef|createPortal|useNavigate|useParams|useLocation|createContext|createSelector|createSlice|createAsyncThunk|configureStore|useSelector|useDispatch)(?![\w$])/y,
  },
  {
    type: "global",
    regex:
      /\b(?:fetch|console|window|document|URL|setTimeout|clearTimeout|setInterval|clearInterval|Math|Date|Array|Object|String|Number|Boolean|Promise|Error|JSON|Map|Set|WeakMap|WeakSet|Symbol|Proxy|Reflect|RegExp|parseInt|parseFloat|isNaN|isFinite|encodeURIComponent|decodeURIComponent|alert|confirm|prompt|localStorage|sessionStorage|navigator|location|history|performance|AbortController|FormData|Headers|Request|Response|ReadableStream|WritableStream|TextEncoder|TextDecoder|Blob|File|FileReader|XMLHttpRequest|WebSocket|Worker|SharedWorker|IntersectionObserver|MutationObserver|ResizeObserver|requestAnimationFrame|cancelAnimationFrame|queueMicrotask|structuredClone|Element|Event|Node)(?![\w$])/y,
  },
  { type: "function-call", regex: /[a-zA-Z_$][\w$]*(?=\s*\()/y },
  { type: "property", regex: /(\.)([a-zA-Z_$][\w$]*)/y },
  { type: "ident", regex: /[a-zA-Z_$][\w$]*/y },
  { type: "punct", regex: /[^\s\w]/y },
  { type: "space", regex: /\s+/y },
];

export const RULES = { js: createRules(false), ts: createRules(true) };

export const REGEX_PRECEDING_TOKENS = new Set([
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

/** A value just ended, so `<` and `/` are operators rather than markup or a regex. */
export const VALUE_TOKENS = new Set([
  "ident",
  "number",
  "string",
  "template",
  "regex",
  "boolean",
  "type",
  "global",
  "property",
  "function-call",
  "react-hook",
  "update",
  "private-name",
]);

export const TOKEN_CLASSES: Record<string, string> = {
  number: "hl-num",
  keyword: "hl-kw",
  boolean: "hl-bool",
  type: "hl-type",
  "react-hook": "hl-hook",
  global: "hl-global",
  "function-call": "hl-fn",
  decorator: "hl-fn",
  "private-name": "hl-prop",
};
