import { getDefaultHTMLDataProvider } from "vscode-html-languageservice";
import { REACT_INTRINSIC_TAG_NAMES } from "./react-intrinsic-tags";

export interface MarkupTagInfo {
  name: string;
  detail: string;
}

export const HTML_DATA_PROVIDER = getDefaultHTMLDataProvider();
const htmlTags = HTML_DATA_PROVIDER.provideTags();
const descriptions = new Map(htmlTags.map((tag) => [tag.name, tag.description]));
// Retain familiar ordering for the empty '<' menu, without limiting vocabulary.
const names = new Set([
  "div",
  "span",
  "button",
  "input",
  "p",
  "a",
  "form",
  "label",
  "section",
  "main",
  ...htmlTags.map((tag) => tag.name),
  ...REACT_INTRINSIC_TAG_NAMES,
]);

export const MARKUP_TAGS: readonly MarkupTagInfo[] = [...names].map((name) => {
  const description = descriptions.get(name);
  return {
    name,
    detail:
      (typeof description === "string" ? description : description?.value) ?? `Element <${name}>`,
  };
});
export const MARKUP_TAG_NAMES: ReadonlySet<string> = new Set(names);
