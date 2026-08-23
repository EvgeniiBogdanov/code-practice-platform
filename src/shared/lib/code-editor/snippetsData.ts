/**
 * Autocomplete & Snippets Static Knowledge Base
 */

export interface SnippetItem {
  prefix: string;
  label: string;
  detail: string;
  kind?: string;
  body: string | ((compName: string) => string);
  cursorOffset?: number;
}

export interface CompletionItem {
  prefix: string;
  label: string;
  detail: string;
  kind?: string;
  insertText: string;
  snippet?: SnippetItem;
  autoImport?: { symbol: string; module: string; isDefault: boolean };
  replaceStart?: number;
  replaceEnd?: number;
  cursorOffset?: number;
  score?: number;
}

export const KNOWN_MODULES: Record<string, { name: string; default?: string; named?: string[] }> = {
  react: {
    name: "react",
    default: "React",
    named: [
      "useState",
      "useEffect",
      "useContext",
      "useReducer",
      "useCallback",
      "useMemo",
      "useRef",
      "useImperativeHandle",
      "useLayoutEffect",
      "useDebugValue",
      "useDeferredValue",
      "useTransition",
      "useId",
      "useSyncExternalStore",
      "useInsertionEffect",
      "memo",
      "forwardRef",
      "createContext",
      "lazy",
      "Suspense",
      "Fragment",
      "StrictMode",
      "Component",
      "PureComponent",
      "createRef",
      "Children",
      "cloneElement",
      "isValidElement",
      "startTransition",
      "FC",
      "FunctionComponent",
      "ReactNode",
      "ReactElement",
      "ReactPortal",
      "CSSProperties",
      "ChangeEvent",
      "MouseEvent",
      "KeyboardEvent",
      "FormEvent",
      "FocusEvent",
      "PointerEvent",
      "TouchEvent",
      "SyntheticEvent",
      "RefObject",
      "MutableRefObject",
      "ForwardedRef",
      "Ref",
      "Dispatch",
      "SetStateAction",
      "PropsWithChildren",
      "ComponentPropsWithoutRef",
      "ComponentPropsWithRef",
      "ComponentProps",
      "ElementRef",
      "ElementType",
      "Reducer",
      "ReducerState",
      "ReducerAction",
      "Context",
      "Key",
    ],
  },
  "react-dom": {
    name: "react-dom",
    default: "ReactDOM",
    named: ["createPortal", "flushSync", "findDOMNode", "unmountComponentAtNode", "render"],
  },
  "react-dom/client": {
    name: "react-dom/client",
    named: ["createRoot", "hydrateRoot"],
  },
  "@reduxjs/toolkit": {
    name: "@reduxjs/toolkit",
    named: [
      "createSlice",
      "configureStore",
      "createAsyncThunk",
      "createAction",
      "createReducer",
      "combineReducers",
      "createSelector",
      "createEntityAdapter",
      "isAnyOf",
      "isPending",
      "isFulfilled",
      "isRejected",
      "PayloadAction",
    ],
  },
  "react-redux": {
    name: "react-redux",
    named: ["useSelector", "useDispatch", "useStore", "Provider", "connect", "shallowEqual"],
  },
  zustand: {
    name: "zustand",
    named: ["create", "useStore"],
  },
  "zustand/middleware": {
    name: "zustand/middleware",
    named: ["persist", "devtools", "combine", "immer", "subscribeWithSelector"],
  },
  "@tanstack/react-router": {
    name: "@tanstack/react-router",
    named: [
      "Link",
      "useNavigate",
      "useParams",
      "useSearch",
      "useRouter",
      "createRoute",
      "createRootRoute",
      "createRouter",
      "Outlet",
      "useMatch",
      "useLoaderData",
      "useRouteContext",
      "RouterProvider",
      "redirect",
      "notFound",
    ],
  },
  "lucide-react": {
    name: "lucide-react",
    named: [
      "RotateCcw",
      "Copy",
      "Check",
      "FileCode",
      "Maximize2",
      "Minimize2",
      "WrapText",
      "Undo2",
      "Redo2",
      "CheckCircle2",
      "Code2",
      "AlertCircle",
      "Wand2",
      "ZoomIn",
      "ZoomOut",
      "Sparkles",
      "Box",
      "Globe",
      "Search",
      "Plus",
      "Trash",
      "Trash2",
      "Edit",
      "Save",
      "Download",
      "Upload",
      "Play",
      "Pause",
      "X",
      "Menu",
      "ChevronDown",
      "ChevronUp",
      "ChevronLeft",
      "ChevronRight",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "ExternalLink",
      "Eye",
      "EyeOff",
      "Lock",
      "Unlock",
      "Settings",
      "User",
      "Users",
      "Heart",
      "Star",
    ],
  },
  marked: {
    name: "marked",
    default: "marked",
    named: ["marked", "parse"],
  },
  dompurify: {
    name: "dompurify",
    default: "DOMPurify",
    named: ["DOMPurify", "sanitize"],
  },
};

export const REACT_HOOKS = [
  "useState",
  "useEffect",
  "useCallback",
  "useMemo",
  "useRef",
  "useContext",
  "useReducer",
  "useLayoutEffect",
  "useId",
  "useTransition",
  "useDeferredValue",
  "useSyncExternalStore",
];

export const JS_KEYWORDS = [
  "const",
  "let",
  "var",
  "function",
  "return",
  "import",
  "export",
  "default",
  "async",
  "await",
  "if",
  "else",
  "for",
  "while",
  "do",
  "switch",
  "case",
  "break",
  "continue",
  "throw",
  "try",
  "catch",
  "finally",
  "new",
  "typeof",
  "instanceof",
  "in",
  "of",
  "from",
  "as",
  "class",
  "extends",
  "yield",
];

export const JS_GLOBALS = [
  "console",
  "window",
  "document",
  "Math",
  "Date",
  "Array",
  "Object",
  "String",
  "Number",
  "Boolean",
  "Promise",
  "JSON",
  "Map",
  "Set",
  "setTimeout",
  "clearTimeout",
  "setInterval",
  "clearInterval",
  "fetch",
];

export const TS_UTILITY_TYPES = [
  {
    name: "Partial",
    label: "Partial<T>",
    detail: "Делает все свойства типа необязательными",
    insertText: "Partial<$1>",
    autoImport: { symbol: "Partial", module: "typescript", isDefault: false },
  },
  {
    name: "Required",
    label: "Required<T>",
    detail: "Делает все свойства типа обязательными",
    insertText: "Required<$1>",
    autoImport: { symbol: "Required", module: "typescript", isDefault: false },
  },
  {
    name: "Readonly",
    label: "Readonly<T>",
    detail: "Помечает все свойства типа только для чтения",
    insertText: "Readonly<$1>",
    autoImport: { symbol: "Readonly", module: "typescript", isDefault: false },
  },
  {
    name: "Record",
    label: "Record<K, T>",
    detail: "Объектный тип с ключами K и значениями T",
    insertText: "Record<$1, $2>",
    autoImport: { symbol: "Record", module: "typescript", isDefault: false },
  },
  {
    name: "Pick",
    label: "Pick<T, K>",
    detail: "Выбирает набор свойств K из типа T",
    insertText: "Pick<$1, $2>",
    autoImport: { symbol: "Pick", module: "typescript", isDefault: false },
  },
  {
    name: "Omit",
    label: "Omit<T, K>",
    detail: "Исключает набор свойств K из типа T",
    insertText: "Omit<$1, $2>",
    autoImport: { symbol: "Omit", module: "typescript", isDefault: false },
  },
  {
    name: "Exclude",
    label: "Exclude<T, U>",
    detail: "Исключает из T те типы, которые совместимы с U",
    insertText: "Exclude<$1, $2>",
    autoImport: { symbol: "Exclude", module: "typescript", isDefault: false },
  },
  {
    name: "Extract",
    label: "Extract<T, U>",
    detail: "Извлекает из T типы, совместимые с U",
    insertText: "Extract<$1, $2>",
    autoImport: { symbol: "Extract", module: "typescript", isDefault: false },
  },
  {
    name: "NonNullable",
    label: "NonNullable<T>",
    detail: "Исключает null и undefined из типа T",
    insertText: "NonNullable<$1>",
    autoImport: { symbol: "NonNullable", module: "typescript", isDefault: false },
  },
  {
    name: "ReturnType",
    label: "ReturnType<T>",
    detail: "Извлекает тип возвращаемого значения функции T",
    insertText: "ReturnType<$1>",
    autoImport: { symbol: "ReturnType", module: "typescript", isDefault: false },
  },
  {
    name: "Parameters",
    label: "Parameters<T>",
    detail: "Получает кортеж параметров функции T",
    insertText: "Parameters<$1>",
    autoImport: { symbol: "Parameters", module: "typescript", isDefault: false },
  },
  {
    name: "Awaited",
    label: "Awaited<T>",
    detail: "Разворачивает промис Promise<T> до базового типа",
    insertText: "Awaited<$1>",
    autoImport: { symbol: "Awaited", module: "typescript", isDefault: false },
  },
  {
    name: "FC",
    label: "FC<Props>",
    detail: "React.FunctionComponent<Props>",
    insertText: "FC<$1>",
    autoImport: { symbol: "FC", module: "react", isDefault: false },
  },
  {
    name: "PropsWithChildren",
    label: "PropsWithChildren<Props>",
    detail: "Добавляет свойство children?: ReactNode к пропсам",
    insertText: "PropsWithChildren<$1>",
    autoImport: { symbol: "PropsWithChildren", module: "react", isDefault: false },
  },
  {
    name: "ReactNode",
    label: "ReactNode",
    detail: "Тип для любого JSX-совместимого узла",
    insertText: "ReactNode",
    autoImport: { symbol: "ReactNode", module: "react", isDefault: false },
  },
  {
    name: "ChangeEvent",
    label: "ChangeEvent<HTMLInputElement>",
    detail: "Событие изменения инпута формы",
    insertText: "ChangeEvent<$1>",
    autoImport: { symbol: "ChangeEvent", module: "react", isDefault: false },
  },
  {
    name: "MouseEvent",
    label: "MouseEvent<HTMLButtonElement>",
    detail: "Событие клика мыши в React",
    insertText: "MouseEvent<$1>",
    autoImport: { symbol: "MouseEvent", module: "react", isDefault: false },
  },
];

export const TS_GENERIC_TYPE_SUGGESTIONS = [
  {
    name: "HTMLInputElement",
    label: "HTMLInputElement",
    detail: "DOM <input> элемент",
    insertText: "HTMLInputElement",
  },
  {
    name: "HTMLButtonElement",
    label: "HTMLButtonElement",
    detail: "DOM <button> элемент",
    insertText: "HTMLButtonElement",
  },
  {
    name: "HTMLSelectElement",
    label: "HTMLSelectElement",
    detail: "DOM <select> элемент",
    insertText: "HTMLSelectElement",
  },
  {
    name: "HTMLTextAreaElement",
    label: "HTMLTextAreaElement",
    detail: "DOM <textarea> элемент",
    insertText: "HTMLTextAreaElement",
  },
  {
    name: "HTMLFormElement",
    label: "HTMLFormElement",
    detail: "DOM <form> элемент",
    insertText: "HTMLFormElement",
  },
  {
    name: "HTMLDivElement",
    label: "HTMLDivElement",
    detail: "DOM <div> элемент",
    insertText: "HTMLDivElement",
  },
  {
    name: "HTMLElement",
    label: "HTMLElement",
    detail: "Базовый HTML DOM элемент",
    insertText: "HTMLElement",
  },
  { name: "string", label: "string", detail: "Примитивный строковый тип", insertText: "string" },
  { name: "number", label: "number", detail: "Примитивный числовой тип", insertText: "number" },
  {
    name: "boolean",
    label: "boolean",
    detail: "Примитивный логический тип",
    insertText: "boolean",
  },
  { name: "null", label: "null", detail: "Тип null", insertText: "null" },
];

export const JSX_ELEMENTS = [
  { name: "div", detail: "HTML <div> блок" },
  { name: "span", detail: "HTML <span> строчный элемент" },
  { name: "button", detail: "HTML <button> кнопка" },
  { name: "input", detail: "HTML <input> поле ввода" },
  { name: "p", detail: "HTML <p> параграф текста" },
  { name: "h1", detail: "HTML <h1> заголовок 1 уровня" },
  { name: "h2", detail: "HTML <h2> заголовок 2 уровня" },
  { name: "ul", detail: "HTML <ul> маркированный список" },
  { name: "li", detail: "HTML <li> элемент списка" },
  { name: "form", detail: "HTML <form> форма" },
  { name: "Fragment", detail: "React.Fragment обертка" },
];

export const JS_SNIPPETS: SnippetItem[] = [
  {
    prefix: "rfce",
    label: "rfce ⚡ (React Function Component)",
    detail: "Создать функциональный компонент React с экспортом по умолчанию",
    body: (compName: string) =>
      `export default function ${compName}() {\n  return (\n    <div>\n      \n    </div>\n  );\n}`,
  },
  {
    prefix: "rfc",
    label: "rfc ⚡ (Named React Component)",
    detail: "Создать именованный функциональный компонент React",
    body: (compName: string) =>
      `export function ${compName}() {\n  return (\n    <div>\n      \n    </div>\n  );\n}`,
  },
  {
    prefix: "usestate",
    label: "useState ⚡ (State Hook)",
    detail: "Хук состояния React useState",
    body: "const [state, setState] = useState(initialState);",
  },
  {
    prefix: "useeffect",
    label: "useEffect ⚡ (Effect Hook)",
    detail: "Хук побочных эффектов React useEffect",
    body: "useEffect(() => {\n  $1\n}, []);",
  },
  {
    prefix: "usecallback",
    label: "useCallback ⚡ (Callback Hook)",
    detail: "Мемоизированная функция React useCallback",
    body: "const memoizedCallback = useCallback(() => {\n  $1\n}, []);",
  },
  {
    prefix: "usememo",
    label: "useMemo ⚡ (Memo Hook)",
    detail: "Мемоизированное значение React useMemo",
    body: "const memoizedValue = useMemo(() => {\n  return $1;\n}, []);",
  },
  {
    prefix: "useref",
    label: "useRef ⚡ (Ref Hook)",
    detail: "Хук мутабельной ссылки React useRef",
    body: "const ref = useRef(null);",
  },
  {
    prefix: "clg",
    label: "clg ⚡ (console.log)",
    detail: "Вывод в консоль console.log()",
    body: "console.log($1);",
  },
  {
    prefix: "trycatch",
    label: "trycatch ⚡ (Try/Catch Block)",
    detail: "Блок обработки ошибок try...catch",
    body: "try {\n  $1\n} catch (error) {\n  console.error(error);\n}",
  },
];

export const JS_MEMBER_COMPLETIONS: Record<
  string,
  Array<{ label: string; insertText: string; detail: string; kind: string }>
> = {
  console: [
    { label: "log", insertText: "log($1)", detail: "console.log(...data)", kind: "method" },
    { label: "error", insertText: "error($1)", detail: "console.error(...data)", kind: "method" },
    { label: "warn", insertText: "warn($1)", detail: "console.warn(...data)", kind: "method" },
    { label: "info", insertText: "info($1)", detail: "console.info(...data)", kind: "method" },
  ],
  array: [
    {
      label: "map",
      insertText: "map((item) => $1)",
      detail: "(callback) => Array",
      kind: "method",
    },
    {
      label: "filter",
      insertText: "filter((item) => $1)",
      detail: "(predicate) => Array",
      kind: "method",
    },
    {
      label: "reduce",
      insertText: "reduce((acc, curr) => acc, init)",
      detail: "(callback, init) => any",
      kind: "method",
    },
    {
      label: "forEach",
      insertText: "forEach((item) => $1)",
      detail: "(callback) => void",
      kind: "method",
    },
    {
      label: "find",
      insertText: "find((item) => $1)",
      detail: "(predicate) => item | undefined",
      kind: "method",
    },
    {
      label: "findIndex",
      insertText: "findIndex((item) => $1)",
      detail: "(predicate) => number",
      kind: "method",
    },
    {
      label: "some",
      insertText: "some((item) => $1)",
      detail: "(predicate) => boolean",
      kind: "method",
    },
    {
      label: "every",
      insertText: "every((item) => $1)",
      detail: "(predicate) => boolean",
      kind: "method",
    },
    { label: "includes", insertText: "includes($1)", detail: "(value) => boolean", kind: "method" },
    {
      label: "slice",
      insertText: "slice(start, end)",
      detail: "(start, end) => Array",
      kind: "method",
    },
    { label: "length", insertText: "length", detail: "number — длина массива", kind: "property" },
  ],
  string: [
    {
      label: "slice",
      insertText: "slice(start, end)",
      detail: "(start, end) => string",
      kind: "method",
    },
    {
      label: "substring",
      insertText: "substring(start, end)",
      detail: "(start, end) => string",
      kind: "method",
    },
    { label: "trim", insertText: "trim()", detail: "() => string", kind: "method" },
    { label: "toLowerCase", insertText: "toLowerCase()", detail: "() => string", kind: "method" },
    { label: "toUpperCase", insertText: "toUpperCase()", detail: "() => string", kind: "method" },
    {
      label: "split",
      insertText: "split('$1')",
      detail: "(separator) => string[]",
      kind: "method",
    },
    {
      label: "replace",
      insertText: "replace($1, $2)",
      detail: "(pattern, replacement) => string",
      kind: "method",
    },
    {
      label: "replaceAll",
      insertText: "replaceAll($1, $2)",
      detail: "(pattern, replacement) => string",
      kind: "method",
    },
    {
      label: "includes",
      insertText: "includes('$1')",
      detail: "(searchString) => boolean",
      kind: "method",
    },
    {
      label: "startsWith",
      insertText: "startsWith('$1')",
      detail: "(searchString) => boolean",
      kind: "method",
    },
    {
      label: "endsWith",
      insertText: "endsWith('$1')",
      detail: "(searchString) => boolean",
      kind: "method",
    },
    { label: "length", insertText: "length", detail: "number — длина строки", kind: "property" },
  ],
  object: [
    {
      label: "hasOwnProperty",
      insertText: "hasOwnProperty('$1')",
      detail: "(prop) => boolean",
      kind: "method",
    },
    { label: "toString", insertText: "toString()", detail: "() => string", kind: "method" },
  ],
  promise: [
    {
      label: "then",
      insertText: "then((res) => $1)",
      detail: "(onfulfilled) => Promise",
      kind: "method",
    },
    {
      label: "catch",
      insertText: "catch((err) => $1)",
      detail: "(onrejected) => Promise",
      kind: "method",
    },
    {
      label: "finally",
      insertText: "finally(() => $1)",
      detail: "(onfinally) => Promise",
      kind: "method",
    },
  ],
  event: [
    {
      label: "preventDefault",
      insertText: "preventDefault()",
      detail: "Отменить стандартное действие браузера",
      kind: "method",
    },
    {
      label: "stopPropagation",
      insertText: "stopPropagation()",
      detail: "Остановить всплытие события",
      kind: "method",
    },
    { label: "target", insertText: "target", detail: "Целевой DOM элемент", kind: "property" },
    {
      label: "currentTarget",
      insertText: "currentTarget",
      detail: "Текущий элемент обработчика",
      kind: "property",
    },
    { label: "key", insertText: "key", detail: "string — нажатая клавиша", kind: "property" },
  ],
  target: [
    { label: "value", insertText: "value", detail: "string — значение инпута", kind: "property" },
    {
      label: "checked",
      insertText: "checked",
      detail: "boolean — состояние чекбокса",
      kind: "property",
    },
  ],
  math: [
    { label: "max", insertText: "max($1)", detail: "Math.max(...values)", kind: "method" },
    { label: "min", insertText: "min($1)", detail: "Math.min(...values)", kind: "method" },
    { label: "round", insertText: "round($1)", detail: "Math.round(x)", kind: "method" },
    { label: "floor", insertText: "floor($1)", detail: "Math.floor(x)", kind: "method" },
    { label: "ceil", insertText: "ceil($1)", detail: "Math.ceil(x)", kind: "method" },
    { label: "abs", insertText: "abs($1)", detail: "Math.abs(x)", kind: "method" },
    { label: "random", insertText: "random()", detail: "Math.random()", kind: "method" },
  ],
  json: [
    {
      label: "stringify",
      insertText: "stringify($1)",
      detail: "JSON.stringify(value)",
      kind: "method",
    },
    { label: "parse", insertText: "parse($1)", detail: "JSON.parse(text)", kind: "method" },
  ],
  react: [
    { label: "useState", insertText: "useState($1)", detail: "React.useState()", kind: "method" },
    {
      label: "useEffect",
      insertText: "useEffect($1)",
      detail: "React.useEffect()",
      kind: "method",
    },
    {
      label: "useCallback",
      insertText: "useCallback($1)",
      detail: "React.useCallback()",
      kind: "method",
    },
    { label: "useMemo", insertText: "useMemo($1)", detail: "React.useMemo()", kind: "method" },
    { label: "useRef", insertText: "useRef($1)", detail: "React.useRef()", kind: "method" },
    { label: "memo", insertText: "memo($1)", detail: "React.memo()", kind: "method" },
    {
      label: "forwardRef",
      insertText: "forwardRef($1)",
      detail: "React.forwardRef()",
      kind: "method",
    },
    {
      label: "createContext",
      insertText: "createContext($1)",
      detail: "React.createContext()",
      kind: "method",
    },
  ],
  reactdom: [
    {
      label: "createPortal",
      insertText: "createPortal($1, $2)",
      detail: "ReactDOM.createPortal()",
      kind: "method",
    },
  ],
};

export const REACT_CSS_PROPERTIES = [
  {
    label: "display",
    insertText: "display: '$1'",
    detail: "CSS display property",
    kind: "property",
  },
  {
    label: "flexDirection",
    insertText: "flexDirection: '$1'",
    detail: "CSS flex-direction",
    kind: "property",
  },
  {
    label: "justifyContent",
    insertText: "justifyContent: '$1'",
    detail: "CSS justify-content",
    kind: "property",
  },
  {
    label: "alignItems",
    insertText: "alignItems: '$1'",
    detail: "CSS align-items",
    kind: "property",
  },
  { label: "gap", insertText: "gap: '$1'", detail: "CSS gap", kind: "property" },
  { label: "padding", insertText: "padding: '$1'", detail: "CSS padding", kind: "property" },
  { label: "margin", insertText: "margin: '$1'", detail: "CSS margin", kind: "property" },
  { label: "color", insertText: "color: '$1'", detail: "CSS color", kind: "property" },
  {
    label: "backgroundColor",
    insertText: "backgroundColor: '$1'",
    detail: "CSS background-color",
    kind: "property",
  },
  { label: "width", insertText: "width: '$1'", detail: "CSS width", kind: "property" },
  { label: "height", insertText: "height: '$1'", detail: "CSS height", kind: "property" },
];

export const REACT_JSX_PROPS: Record<
  string,
  Array<{ label: string; insertText: string; detail: string; kind: string }>
> = {
  common: [
    {
      label: "className",
      insertText: 'className="$1"',
      detail: "CSS класс элемента",
      kind: "property",
    },
    {
      label: "style",
      insertText: "style={{ $1 }}",
      detail: "Инлайн стили объекта",
      kind: "property",
    },
    { label: "key", insertText: "key={$1}", detail: "React key идентификатор", kind: "property" },
    { label: "id", insertText: 'id="$1"', detail: "HTML id атрибут", kind: "property" },
    { label: "ref", insertText: "ref={$1}", detail: "React ref ссылка", kind: "property" },
    {
      label: "children",
      insertText: "children={$1}",
      detail: "Дочерние элементы",
      kind: "property",
    },
  ],
  events: [
    {
      label: "onClick",
      insertText: "onClick={$1}",
      detail: "(e: MouseEvent) => void",
      kind: "event",
    },
    {
      label: "onChange",
      insertText: "onChange={$1}",
      detail: "(e: ChangeEvent) => void",
      kind: "event",
    },
    {
      label: "onSubmit",
      insertText: "onSubmit={$1}",
      detail: "(e: FormEvent) => void",
      kind: "event",
    },
    {
      label: "onKeyDown",
      insertText: "onKeyDown={$1}",
      detail: "(e: KeyboardEvent) => void",
      kind: "event",
    },
    {
      label: "onKeyUp",
      insertText: "onKeyUp={$1}",
      detail: "(e: KeyboardEvent) => void",
      kind: "event",
    },
    {
      label: "onFocus",
      insertText: "onFocus={$1}",
      detail: "(e: FocusEvent) => void",
      kind: "event",
    },
    {
      label: "onBlur",
      insertText: "onBlur={$1}",
      detail: "(e: FocusEvent) => void",
      kind: "event",
    },
  ],
  button: [
    {
      label: "type",
      insertText: 'type="$1"',
      detail: "'button' | 'submit' | 'reset'",
      kind: "property",
    },
    {
      label: "disabled",
      insertText: "disabled",
      detail: "boolean — отключить кнопку",
      kind: "property",
    },
  ],
  input: [
    {
      label: "type",
      insertText: 'type="$1"',
      detail: "'text' | 'number' | 'checkbox' | 'password'",
      kind: "property",
    },
    { label: "value", insertText: "value={$1}", detail: "Управляемое значение", kind: "property" },
    {
      label: "placeholder",
      insertText: 'placeholder="$1"',
      detail: "Текст подсказки",
      kind: "property",
    },
    {
      label: "disabled",
      insertText: "disabled",
      detail: "boolean — отключить поле",
      kind: "property",
    },
    {
      label: "checked",
      insertText: "checked={$1}",
      detail: "Состояние чекбокса",
      kind: "property",
    },
  ],
};

export function isTypeScriptGenericContext(text: string): boolean {
  if (!text) return false;
  return (
    /\b(?:type|interface)\s+[A-Z][a-zA-Z0-9_$]*\s*<[^>]*$/.test(text) ||
    /\b(?:ChangeEvent|MouseEvent|KeyboardEvent|FormEvent|FocusEvent|PointerEvent|TouchEvent|SyntheticEvent)\s*<[^>]*$/.test(
      text
    ) ||
    /\b(?:useRef|useState|useReducer|createContext|useCallback|useMemo)\s*<[^>]*$/.test(text) ||
    /\b(?:ComponentPropsWithoutRef|ComponentPropsWithRef|ComponentProps|ElementRef|ElementType|PropsWithChildren|FC|FunctionComponent)\s*<[^>]*$/.test(
      text
    ) ||
    /\b(?:Record|Partial|Required|Readonly|Pick|Omit|Exclude|Extract|NonNullable|ReturnType|Parameters|InstanceType|Awaited|Array|Promise|Set|Map|WeakMap|WeakSet)\s*<[^>]*$/.test(
      text
    )
  );
}
