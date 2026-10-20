import type { EditorState } from "@tiptap/pm/state";
import { SuggestionPluginKey } from "@tiptap/suggestion";

interface BlockMenuState {
  active: boolean;
  range: { from: number; to: number };
}

const isBlockMenuState = (value: unknown): value is BlockMenuState =>
  typeof value === "object" && value !== null && "active" in value && "range" in value;

/**
 * Where the block menu opened by the "+" button waits for its filter: the start of its still empty
 * line, as in Notion. A "/" typed by hand always gives the menu a non-empty range.
 */
export const getBlockMenuFilterPos = (state: EditorState): number | null => {
  const menu: unknown = SuggestionPluginKey.getState(state);
  if (!isBlockMenuState(menu) || !menu.active || menu.range.from !== menu.range.to) return null;
  return menu.range.from;
};
