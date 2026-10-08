import type { ChainedCommands } from "@tiptap/core";
import {
  CheckSquare,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Table,
  type LucideIcon,
} from "lucide-react";

export interface BlockItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Extra words the "/" query is matched against. */
  keywords: readonly string[];
  /** Adds a block instead of reshaping the current one, so it cannot be a "turn into" target. */
  isInsertOnly?: boolean;
  /** Turns the current empty line into this block. */
  apply: (chain: ChainedCommands) => ChainedCommands;
}

export const BLOCK_ITEMS: readonly BlockItem[] = [
  {
    id: "paragraph",
    title: "Текст",
    description: "Обычный абзац",
    icon: Pilcrow,
    keywords: ["text", "paragraph", "абзац", "параграф"],
    apply: (chain) => chain.setParagraph(),
  },
  {
    id: "heading1",
    title: "Заголовок 1",
    description: "Крупный заголовок раздела",
    icon: Heading1,
    keywords: ["h1", "heading", "заголовок"],
    apply: (chain) => chain.setHeading({ level: 1 }),
  },
  {
    id: "heading2",
    title: "Заголовок 2",
    description: "Средний заголовок",
    icon: Heading2,
    keywords: ["h2", "heading", "заголовок"],
    apply: (chain) => chain.setHeading({ level: 2 }),
  },
  {
    id: "heading3",
    title: "Заголовок 3",
    description: "Мелкий заголовок",
    icon: Heading3,
    keywords: ["h3", "heading", "заголовок"],
    apply: (chain) => chain.setHeading({ level: 3 }),
  },
  {
    id: "bulletList",
    title: "Маркированный список",
    description: "Простой список с точками",
    icon: List,
    keywords: ["bullet", "list", "ul", "список"],
    apply: (chain) => chain.toggleBulletList(),
  },
  {
    id: "orderedList",
    title: "Нумерованный список",
    description: "Список с номерами",
    icon: ListOrdered,
    keywords: ["numbered", "ordered", "list", "ol", "список", "нумерованный"],
    apply: (chain) => chain.toggleOrderedList(),
  },
  {
    id: "taskList",
    title: "Список задач",
    description: "Чек-лист с галочками",
    icon: CheckSquare,
    keywords: ["todo", "task", "checkbox", "чеклист", "задачи"],
    apply: (chain) => chain.toggleTaskList(),
  },
  {
    id: "blockquote",
    title: "Цитата",
    description: "Выделить мысль или цитату",
    icon: Quote,
    keywords: ["quote", "blockquote", "цитата"],
    apply: (chain) => chain.toggleBlockquote(),
  },
  {
    id: "codeBlock",
    title: "Код",
    description: "Блок кода с моноширинным шрифтом",
    icon: Code2,
    keywords: ["code", "pre", "код"],
    apply: (chain) => chain.toggleCodeBlock(),
  },
  {
    id: "table",
    title: "Таблица",
    description: "Таблица 3×3 с заголовком",
    icon: Table,
    keywords: ["table", "grid", "таблица"],
    isInsertOnly: true,
    apply: (chain) => chain.insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
  },
  {
    id: "divider",
    title: "Разделитель",
    description: "Горизонтальная линия",
    icon: Minus,
    keywords: ["divider", "hr", "line", "разделитель", "линия"],
    isInsertOnly: true,
    apply: (chain) => chain.setHorizontalRule(),
  },
];

export const filterBlockItems = (query: string): readonly BlockItem[] => {
  const needle = query.trim().toLowerCase();
  if (!needle) return BLOCK_ITEMS;
  return BLOCK_ITEMS.filter((item) =>
    [item.title, ...item.keywords].some((word) => word.toLowerCase().includes(needle))
  );
};

/** Blocks a line can be turned into from the block menu. */
export const CONVERT_ITEMS: readonly BlockItem[] = BLOCK_ITEMS.filter((item) => !item.isInsertOnly);
