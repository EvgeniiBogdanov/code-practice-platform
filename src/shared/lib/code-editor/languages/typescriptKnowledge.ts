/**
 * TypeScript Knowledge Base
 */

import { SnippetItem } from "../snippetsData";

export const TS_KEYWORDS = [
  "type",
  "interface",
  "enum",
  "implements",
  "declare",
  "namespace",
  "as",
  "is",
  "keyof",
  "readonly",
  "override",
  "abstract",
  "satisfies",
  "infer",
  "never",
  "unknown",
  "any",
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
    detail: "Исключает из T типы, совместимые с U",
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
];

export const REACT_TS_TYPES = [
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
  {
    name: "FormEvent",
    label: "FormEvent<HTMLFormElement>",
    detail: "Событие отправки формы в React",
    insertText: "FormEvent<$1>",
    autoImport: { symbol: "FormEvent", module: "react", isDefault: false },
  },
  {
    name: "RefObject",
    label: "RefObject<T>",
    detail: "React ref объект (read-only current)",
    insertText: "RefObject<$1>",
    autoImport: { symbol: "RefObject", module: "react", isDefault: false },
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
  { name: "undefined", label: "undefined", detail: "Тип undefined", insertText: "undefined" },
  { name: "void", label: "void", detail: "Тип void", insertText: "void" },
  { name: "never", label: "never", detail: "Тип never", insertText: "never" },
  { name: "unknown", label: "unknown", detail: "Тип unknown", insertText: "unknown" },
];

export const TS_SNIPPETS: SnippetItem[] = [
  {
    prefix: "interface",
    label: "interface ⚡ (TypeScript Interface)",
    detail: "Объявление интерфейса TypeScript",
    body: "interface $1 {\n  $2\n}",
  },
  {
    prefix: "type",
    label: "type ⚡ (TypeScript Type Alias)",
    detail: "Объявление псевдонима типа TypeScript",
    body: "type $1 = $2;",
  },
  {
    prefix: "enum",
    label: "enum ⚡ (TypeScript Enum)",
    detail: "Объявление перечисления TypeScript",
    body: "enum $1 {\n  $2\n}",
  },
];
