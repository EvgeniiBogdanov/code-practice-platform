/**
 * Autocomplete & Snippets Static Knowledge Base (Re-exports and Modules)
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

export {
  JS_KEYWORDS,
  JS_GLOBALS,
  JS_SNIPPETS,
  JS_MEMBER_COMPLETIONS,
} from "./languages/javascriptKnowledge";
export {
  REACT_HOOKS,
  REACT_SNIPPETS,
  JSX_ELEMENTS,
  REACT_JSX_PROPS,
  REACT_CSS_PROPERTIES,
  REACT_MEMBER_COMPLETIONS,
} from "./languages/reactKnowledge";
export {
  TS_KEYWORDS,
  TS_UTILITY_TYPES,
  REACT_TS_TYPES,
  TS_GENERIC_TYPE_SUGGESTIONS,
  TS_SNIPPETS,
} from "./languages/typescriptKnowledge";
export { CSS_PROPERTIES, CSS_VALUES, CSS_PSEUDO_CLASSES } from "./languages/cssKnowledge";
export { HTML_TAGS, HTML_ATTRIBUTES, HTML_SNIPPETS } from "./languages/htmlKnowledge";
export { JSON_SNIPPETS } from "./languages/jsonKnowledge";
export { SQL_KEYWORDS, SQL_TYPES } from "./languages/sqlKnowledge";

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
