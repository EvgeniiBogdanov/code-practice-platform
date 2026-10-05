export type CompletionIcon =
  | "function"
  | "variable"
  | "property"
  | "type"
  | "keyword"
  | "snippet"
  | "module"
  | "tag"
  | "symbol";

export type CompletionTone = "purple" | "blue" | "cyan" | "amber" | "pink" | "green" | "gray";

export interface CompletionKindInfo {
  icon: CompletionIcon;
  tone: CompletionTone;
  /** Short Russian name shown next to the item. */
  label: string;
}

const CALLABLE: CompletionKindInfo = { icon: "function", tone: "purple", label: "Функция" };
const VARIABLE: CompletionKindInfo = { icon: "variable", tone: "blue", label: "Переменная" };
const PROPERTY: CompletionKindInfo = { icon: "property", tone: "cyan", label: "Свойство" };
const TYPE: CompletionKindInfo = { icon: "type", tone: "amber", label: "Тип" };
const MODULE: CompletionKindInfo = { icon: "module", tone: "gray", label: "Модуль" };

/** TypeScript completion kinds plus the editor's own (`snippet`, `import`, `global`, …). */
const KINDS: Record<string, CompletionKindInfo> = {
  function: CALLABLE,
  "local function": CALLABLE,
  method: { ...CALLABLE, label: "Метод" },
  constructor: { ...CALLABLE, label: "Конструктор" },
  call: CALLABLE,
  "react-hook": { ...CALLABLE, label: "Хук" },
  var: VARIABLE,
  "local var": VARIABLE,
  let: VARIABLE,
  const: { ...VARIABLE, label: "Константа" },
  variable: VARIABLE,
  global: { ...VARIABLE, label: "Глобальный" },
  parameter: { ...VARIABLE, label: "Параметр" },
  property: PROPERTY,
  getter: PROPERTY,
  setter: PROPERTY,
  "JSX attribute": { ...PROPERTY, label: "Атрибут" },
  "enum member": { ...PROPERTY, label: "Значение" },
  value: { ...PROPERTY, label: "Значение" },
  class: { ...TYPE, label: "Класс" },
  interface: { ...TYPE, label: "Интерфейс" },
  enum: { ...TYPE, label: "Перечисление" },
  type: TYPE,
  "type parameter": { ...TYPE, label: "Параметр типа" },
  "primitive type": TYPE,
  keyword: { icon: "keyword", tone: "pink", label: "Ключевое слово" },
  snippet: { icon: "snippet", tone: "green", label: "Сниппет" },
  tag: { icon: "tag", tone: "green", label: "Тег" },
  module: MODULE,
  "external module name": MODULE,
  alias: { ...MODULE, label: "Псевдоним" },
  import: { ...MODULE, label: "Импорт" },
  directory: { ...MODULE, label: "Папка" },
  script: { ...MODULE, label: "Файл" },
  string: { icon: "keyword", tone: "gray", label: "Строка" },
};

const FALLBACK: CompletionKindInfo = { icon: "symbol", tone: "gray", label: "Символ" };

/** Icon, colour family and name of a completion, so every kind reads at a glance. */
export const describeCompletionKind = (kind?: string): CompletionKindInfo =>
  (kind && KINDS[kind]) || FALLBACK;
