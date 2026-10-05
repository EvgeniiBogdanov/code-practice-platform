import {
  fuzzyScore,
  type CompletionItem,
  type TypeScriptCompletion,
} from "@/shared/lib/code-editor";

/** TypeScript completion kinds that belong inside a string literal or import path. */
const STRING_CONTEXT_KINDS = new Set(["string", "directory", "script", "external module name"]);

export interface SemanticRankOptions {
  query: string;
  /** Keep only entries that match the typed word. */
  filterByQuery: boolean;
  /** The character just before the caret when it can trigger completions (`.`, a quote, `/`). */
  trigger?: string;
  /** Nothing local and nothing typed: only the trigger's own suggestions qualify. */
  onlyTriggered: boolean;
}

/**
 * Orders TypeScript completions like VS Code's suggest widget: by fuzzy score (`gfd` finds
 * `getNameOfDeclaration`), TypeScript's own order between equal scores.
 */
export const rankSemanticCompletions = (
  semantic: ReadonlyArray<TypeScriptCompletion>,
  { query, filterByQuery, trigger, onlyTriggered }: SemanticRankOptions
): TypeScriptCompletion[] => {
  const ranked = semantic
    .map((item) => ({ item, score: filterByQuery ? fuzzyScore(item.label, query)?.score : 0 }))
    .filter(
      (entry): entry is { item: TypeScriptCompletion; score: number } => entry.score !== undefined
    )
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
  return onlyTriggered
    ? ranked.filter((item) => trigger === "." || STRING_CONTEXT_KINDS.has(item.kind))
    : ranked;
};

/** Local suggestions VS Code's matcher keeps for the typed word, plus the engine's strong picks. */
export const filterLocalCompletions = (items: CompletionItem[], word: string): CompletionItem[] =>
  items.filter((item) => fuzzyScore(item.prefix, word) !== null || (item.score ?? 0) >= 50);

/**
 * One list ordered like VS Code: by how well the typed word matches each item's trigger
 * (a snippet's prefix, a symbol's name), so `clg` puts its snippet first. Equal scores keep
 * TypeScript before local items; words scraped from the text only fill in before it answers.
 */
export const mergeCompletions = (
  semantic: CompletionItem[],
  local: CompletionItem[],
  word: string
): CompletionItem[] => {
  const known = new Set(semantic.map((item) => item.label));
  return [
    ...semantic,
    ...local.filter((item) => !known.has(item.label) && item.kind !== "variable"),
  ]
    .map((item, index) => ({ item, index, score: fuzzyScore(item.prefix, word)?.score ?? -1 }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 24)
    .map(({ item }) => item);
};
