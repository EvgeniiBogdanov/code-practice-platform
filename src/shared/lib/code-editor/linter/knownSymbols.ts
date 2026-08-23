/**
 * Known Symbols Knowledge Base for Missing Import Linter
 */

export interface KnownSymbolInfo {
  module: string;
  isDefault: boolean;
  category: "hook" | "api" | "type" | "namespace" | "redux" | "zustand" | "icon" | "local";
  isComponent?: boolean;
  requiresCallCheck?: boolean;
}

export const KNOWN_SYMBOLS: Record<string, KnownSymbolInfo> = {
  // React Hooks
  useState: { module: "react", isDefault: false, category: "hook" },
  useEffect: { module: "react", isDefault: false, category: "hook" },
  useContext: { module: "react", isDefault: false, category: "hook" },
  useReducer: { module: "react", isDefault: false, category: "hook" },
  useCallback: { module: "react", isDefault: false, category: "hook" },
  useMemo: { module: "react", isDefault: false, category: "hook" },
  useRef: { module: "react", isDefault: false, category: "hook" },
  useImperativeHandle: { module: "react", isDefault: false, category: "hook" },
  useLayoutEffect: { module: "react", isDefault: false, category: "hook" },
  useDebugValue: { module: "react", isDefault: false, category: "hook" },
  useDeferredValue: { module: "react", isDefault: false, category: "hook" },
  useTransition: { module: "react", isDefault: false, category: "hook" },
  useId: { module: "react", isDefault: false, category: "hook" },
  useSyncExternalStore: { module: "react", isDefault: false, category: "hook" },
  useInsertionEffect: { module: "react", isDefault: false, category: "hook" },

  // React APIs
  createContext: { module: "react", isDefault: false, category: "api" },
  forwardRef: { module: "react", isDefault: false, category: "api" },
  memo: { module: "react", isDefault: false, category: "api" },
  lazy: { module: "react", isDefault: false, category: "api" },
  Suspense: { module: "react", isDefault: false, category: "api" },
  Fragment: { module: "react", isDefault: false, category: "api" },
  StrictMode: { module: "react", isDefault: false, category: "api" },
  Component: { module: "react", isDefault: false, category: "api" },
  PureComponent: { module: "react", isDefault: false, category: "api" },
  createRef: { module: "react", isDefault: false, category: "api" },
  Children: { module: "react", isDefault: false, category: "api" },
  cloneElement: { module: "react", isDefault: false, category: "api" },
  isValidElement: { module: "react", isDefault: false, category: "api" },
  startTransition: { module: "react", isDefault: false, category: "api" },
  React: { module: "react", isDefault: true, category: "namespace" },

  // React Types
  FC: { module: "react", isDefault: false, category: "type" },
  FunctionComponent: { module: "react", isDefault: false, category: "type" },
  ReactNode: { module: "react", isDefault: false, category: "type" },
  ReactElement: { module: "react", isDefault: false, category: "type" },
  ReactPortal: { module: "react", isDefault: false, category: "type" },
  PropsWithChildren: { module: "react", isDefault: false, category: "type" },
  ChangeEvent: { module: "react", isDefault: false, category: "type" },
  MouseEvent: { module: "react", isDefault: false, category: "type" },
  KeyboardEvent: { module: "react", isDefault: false, category: "type" },
  FormEvent: { module: "react", isDefault: false, category: "type" },
  FocusEvent: { module: "react", isDefault: false, category: "type" },
  PointerEvent: { module: "react", isDefault: false, category: "type" },
  TouchEvent: { module: "react", isDefault: false, category: "type" },
  SyntheticEvent: { module: "react", isDefault: false, category: "type" },
  ComponentPropsWithoutRef: { module: "react", isDefault: false, category: "type" },
  ComponentPropsWithRef: { module: "react", isDefault: false, category: "type" },
  ComponentProps: { module: "react", isDefault: false, category: "type" },
  ElementRef: { module: "react", isDefault: false, category: "type" },
  ElementType: { module: "react", isDefault: false, category: "type" },
  MutableRefObject: { module: "react", isDefault: false, category: "type" },
  RefObject: { module: "react", isDefault: false, category: "type" },
  ForwardedRef: { module: "react", isDefault: false, category: "type" },
  Ref: { module: "react", isDefault: false, category: "type" },
  CSSProperties: { module: "react", isDefault: false, category: "type" },
  Dispatch: { module: "react", isDefault: false, category: "type" },
  SetStateAction: { module: "react", isDefault: false, category: "type" },
  Reducer: { module: "react", isDefault: false, category: "type" },
  Context: { module: "react", isDefault: false, category: "type" },
  Key: { module: "react", isDefault: false, category: "type" },

  // React DOM
  createPortal: { module: "react-dom", isDefault: false, category: "api" },
  flushSync: { module: "react-dom", isDefault: false, category: "api" },
  findDOMNode: { module: "react-dom", isDefault: false, category: "api" },
  ReactDOM: { module: "react-dom", isDefault: true, category: "namespace" },
  createRoot: { module: "react-dom/client", isDefault: false, category: "api" },
  hydrateRoot: { module: "react-dom/client", isDefault: false, category: "api" },

  // Redux Toolkit
  createSlice: { module: "@reduxjs/toolkit", isDefault: false, category: "redux" },
  configureStore: { module: "@reduxjs/toolkit", isDefault: false, category: "redux" },
  createAsyncThunk: { module: "@reduxjs/toolkit", isDefault: false, category: "redux" },
  createAction: { module: "@reduxjs/toolkit", isDefault: false, category: "redux" },
  createReducer: { module: "@reduxjs/toolkit", isDefault: false, category: "redux" },
  combineReducers: { module: "@reduxjs/toolkit", isDefault: false, category: "redux" },
  createSelector: { module: "@reduxjs/toolkit", isDefault: false, category: "redux" },
  createEntityAdapter: { module: "@reduxjs/toolkit", isDefault: false, category: "redux" },

  // React Redux
  useSelector: { module: "react-redux", isDefault: false, category: "redux" },
  useDispatch: { module: "react-redux", isDefault: false, category: "redux" },
  Provider: { module: "react-redux", isDefault: false, category: "redux" },
  connect: { module: "react-redux", isDefault: false, category: "redux" },
  shallowEqual: { module: "react-redux", isDefault: false, category: "redux" },

  // Zustand
  create: { module: "zustand", isDefault: false, category: "zustand", requiresCallCheck: true },

  // Lucide Icons
  Flame: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Wrench: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Rocket: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Brain: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Zap: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Search: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Plus: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Trash: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Trash2: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Edit: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Check: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  X: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Heart: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Star: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  User: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Users: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Settings: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  RotateCcw: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Lock: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Code2: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Maximize2: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Eye: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  ChevronDown: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  ChevronUp: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  ChevronLeft: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  ChevronRight: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  AlertCircle: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  CheckCircle2: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  FileCode: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Wand2: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
  Copy: { module: "lucide-react", isDefault: false, category: "icon", isComponent: true },
};
