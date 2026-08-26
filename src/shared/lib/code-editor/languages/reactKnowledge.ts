/**
 * React & JSX Knowledge Base
 */

import { SnippetItem } from "../snippetsData";

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
  "useImperativeHandle",
  "useInsertionEffect",
  "useDebugValue",
];

export const REACT_SNIPPETS: SnippetItem[] = [
  {
    prefix: "rfce",
    label: "rfce ⚡ (React Function Component)",
    detail: "Функциональный компонент React с экспортом по умолчанию",
    body: (compName: string) =>
      `export default function ${compName}() {\n  return (\n    <div>\n      \n    </div>\n  );\n}`,
  },
  {
    prefix: "rfc",
    label: "rfc ⚡ (Named React Component)",
    detail: "Именованный функциональный компонент React",
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
    detail: "Хук эффекта React useEffect",
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
    detail: "Хук ссылки React useRef",
    body: "const ref = useRef(null);",
  },
];

export const JSX_ELEMENTS = [
  { name: "div", detail: "HTML <div> контейнер" },
  { name: "span", detail: "HTML <span> строчный элемент" },
  { name: "button", detail: "HTML <button> кнопка" },
  { name: "input", detail: "HTML <input> поле ввода" },
  { name: "p", detail: "HTML <p> параграф текста" },
  { name: "h1", detail: "HTML <h1> заголовок 1 уровня" },
  { name: "h2", detail: "HTML <h2> заголовок 2 уровня" },
  { name: "h3", detail: "HTML <h3> заголовок 3 уровня" },
  { name: "ul", detail: "HTML <ul> маркированный список" },
  { name: "ol", detail: "HTML <ol> нумерованный список" },
  { name: "li", detail: "HTML <li> элемент списка" },
  { name: "form", detail: "HTML <form> форма" },
  { name: "label", detail: "HTML <label> подпись к полю" },
  { name: "select", detail: "HTML <select> выпадающий список" },
  { name: "option", detail: "HTML <option> вариант выбора" },
  { name: "textarea", detail: "HTML <textarea> многострочный ввод" },
  { name: "table", detail: "HTML <table> таблица" },
  { name: "tr", detail: "HTML <tr> строка таблицы" },
  { name: "td", detail: "HTML <td> ячейка таблицы" },
  { name: "th", detail: "HTML <th> заголовок таблицы" },
  { name: "a", detail: "HTML <a> гиперссылка" },
  { name: "img", detail: "HTML <img> изображение" },
  { name: "header", detail: "HTML <header> шапка" },
  { name: "footer", detail: "HTML <footer> подвал" },
  { name: "nav", detail: "HTML <nav> навигация" },
  { name: "main", detail: "HTML <main> основное содержимое" },
  { name: "section", detail: "HTML <section> секция" },
  { name: "article", detail: "HTML <article> статья" },
  { name: "Fragment", detail: "React.Fragment обертка" },
];

export const REACT_JSX_PROPS: Record<
  string,
  Array<{ label: string; insertText: string; detail: string; kind: string }>
> = {
  common: [
    {
      label: "className",
      insertText: 'className="$1"',
      detail: "CSS class name",
      kind: "property",
    },
    { label: "id", insertText: 'id="$1"', detail: "Element ID", kind: "property" },
    { label: "style", insertText: "style={{ $1 }}", detail: "Inline styles", kind: "property" },
    { label: "key", insertText: "key={$1}", detail: "React list key", kind: "property" },
    { label: "ref", insertText: "ref={$1}", detail: "React ref", kind: "property" },
    { label: "title", insertText: 'title="$1"', detail: "Tooltip text", kind: "property" },
    { label: "tabIndex", insertText: "tabIndex={$1}", detail: "Tab order", kind: "property" },
    { label: "role", insertText: 'role="$1"', detail: "ARIA role", kind: "property" },
    {
      label: "aria-label",
      insertText: 'aria-label="$1"',
      detail: "ARIA accessibility label",
      kind: "property",
    },
    {
      label: "aria-hidden",
      insertText: 'aria-hidden="$1"',
      detail: "Hide from screen readers",
      kind: "property",
    },
    { label: "hidden", insertText: "hidden", detail: "Hide element", kind: "property" },
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
    {
      label: "onMouseEnter",
      insertText: "onMouseEnter={$1}",
      detail: "(e: MouseEvent) => void",
      kind: "event",
    },
    {
      label: "onMouseLeave",
      insertText: "onMouseLeave={$1}",
      detail: "(e: MouseEvent) => void",
      kind: "event",
    },
    {
      label: "onScroll",
      insertText: "onScroll={$1}",
      detail: "(e: UIEvent) => void",
      kind: "event",
    },
  ],
  input: [
    { label: "type", insertText: 'type="text"', detail: "input type", kind: "property" },
    { label: "value", insertText: "value={$1}", detail: "controlled value", kind: "property" },
    {
      label: "defaultValue",
      insertText: 'defaultValue="$1"',
      detail: "initial value",
      kind: "property",
    },
    {
      label: "placeholder",
      insertText: 'placeholder="$1"',
      detail: "placeholder text",
      kind: "property",
    },
    { label: "checked", insertText: "checked={$1}", detail: "checkbox checked", kind: "property" },
    { label: "disabled", insertText: "disabled={$1}", detail: "disabled state", kind: "property" },
    { label: "required", insertText: "required", detail: "required field", kind: "property" },
    { label: "autoFocus", insertText: "autoFocus", detail: "focus on mount", kind: "property" },
    {
      label: "autoComplete",
      insertText: 'autoComplete="off"',
      detail: "autocomplete mode",
      kind: "property",
    },
    { label: "name", insertText: 'name="$1"', detail: "field name", kind: "property" },
  ],
  button: [
    {
      label: "type",
      insertText: 'type="button"',
      detail: "'button' | 'submit' | 'reset'",
      kind: "property",
    },
    { label: "disabled", insertText: "disabled={$1}", detail: "disabled state", kind: "property" },
    { label: "autoFocus", insertText: "autoFocus", detail: "focus on mount", kind: "property" },
  ],
  form: [
    {
      label: "action",
      insertText: 'action="$1"',
      detail: "form submit target URL",
      kind: "property",
    },
    { label: "method", insertText: 'method="POST"', detail: "'GET' | 'POST'", kind: "property" },
  ],
  a: [
    { label: "href", insertText: 'href="$1"', detail: "destination URL", kind: "property" },
    { label: "target", insertText: 'target="_blank"', detail: "link target", kind: "property" },
    { label: "rel", insertText: 'rel="noreferrer"', detail: "link relationship", kind: "property" },
  ],
  img: [
    { label: "src", insertText: 'src="$1"', detail: "image source URL", kind: "property" },
    { label: "alt", insertText: 'alt="$1"', detail: "alternative text", kind: "property" },
    {
      label: "loading",
      insertText: 'loading="lazy"',
      detail: "'lazy' | 'eager'",
      kind: "property",
    },
  ],
};

export const REACT_CSS_PROPERTIES: Array<{
  label: string;
  insertText: string;
  detail: string;
  kind: string;
}> = [
  { label: "display", insertText: "display: '$1'", detail: "CSS display", kind: "property" },
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
  { label: "gap", insertText: "gap: '$1'", detail: "CSS gap spacing", kind: "property" },
  { label: "padding", insertText: "padding: '$1'", detail: "CSS padding", kind: "property" },
  { label: "margin", insertText: "margin: '$1'", detail: "CSS margin", kind: "property" },
  {
    label: "backgroundColor",
    insertText: "backgroundColor: '$1'",
    detail: "CSS background-color",
    kind: "property",
  },
  { label: "color", insertText: "color: '$1'", detail: "CSS text color", kind: "property" },
  { label: "fontSize", insertText: "fontSize: '$1'", detail: "CSS font-size", kind: "property" },
  {
    label: "fontWeight",
    insertText: "fontWeight: '$1'",
    detail: "CSS font-weight",
    kind: "property",
  },
  {
    label: "borderRadius",
    insertText: "borderRadius: '$1'",
    detail: "CSS border-radius",
    kind: "property",
  },
  { label: "border", insertText: "border: '$1'", detail: "CSS border", kind: "property" },
  { label: "width", insertText: "width: '$1'", detail: "CSS width", kind: "property" },
  { label: "height", insertText: "height: '$1'", detail: "CSS height", kind: "property" },
  { label: "position", insertText: "position: '$1'", detail: "CSS position", kind: "property" },
  { label: "cursor", insertText: "cursor: 'pointer'", detail: "CSS cursor", kind: "property" },
  { label: "opacity", insertText: "opacity: $1", detail: "CSS opacity", kind: "property" },
  { label: "zIndex", insertText: "zIndex: $1", detail: "CSS z-index", kind: "property" },
  { label: "overflow", insertText: "overflow: '$1'", detail: "CSS overflow", kind: "property" },
];

export const REACT_MEMBER_COMPLETIONS: Record<
  string,
  Array<{ label: string; insertText: string; detail: string; kind: string }>
> = {
  react: [
    {
      label: "useState",
      insertText: "useState($1)",
      detail: "React.useState(init)",
      kind: "method",
    },
    {
      label: "useEffect",
      insertText: "useEffect($1)",
      detail: "React.useEffect(effect, deps)",
      kind: "method",
    },
    {
      label: "useCallback",
      insertText: "useCallback($1)",
      detail: "React.useCallback(fn, deps)",
      kind: "method",
    },
    {
      label: "useMemo",
      insertText: "useMemo($1)",
      detail: "React.useMemo(factory, deps)",
      kind: "method",
    },
    {
      label: "useRef",
      insertText: "useRef($1)",
      detail: "React.useRef(initialVal)",
      kind: "method",
    },
    {
      label: "useContext",
      insertText: "useContext($1)",
      detail: "React.useContext(context)",
      kind: "method",
    },
    {
      label: "useReducer",
      insertText: "useReducer($1)",
      detail: "React.useReducer(reducer, init)",
      kind: "method",
    },
    { label: "memo", insertText: "memo($1)", detail: "React.memo(Component)", kind: "method" },
    {
      label: "forwardRef",
      insertText: "forwardRef($1)",
      detail: "React.forwardRef(renderFn)",
      kind: "method",
    },
    {
      label: "createContext",
      insertText: "createContext($1)",
      detail: "React.createContext(defaultValue)",
      kind: "method",
    },
    {
      label: "lazy",
      insertText: "lazy($1)",
      detail: "React.lazy(() => import(...))",
      kind: "method",
    },
  ],
  reactdom: [
    {
      label: "createPortal",
      insertText: "createPortal($1)",
      detail: "ReactDOM.createPortal(children, domNode)",
      kind: "method",
    },
    {
      label: "flushSync",
      insertText: "flushSync($1)",
      detail: "ReactDOM.flushSync(callback)",
      kind: "method",
    },
  ],
};
