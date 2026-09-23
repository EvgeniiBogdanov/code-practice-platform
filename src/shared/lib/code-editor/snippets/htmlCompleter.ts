import {
  getLanguageService,
  newHTMLDataProvider,
  TextDocument,
  TextEdit,
  CompletionItemKind,
} from "vscode-html-languageservice";
import { getMarkupContext } from "../markup-context";
import { fuzzyMatch } from "../fuzzyMatcher";
import { MARKUP_TAGS } from "../languages/markup-tags";
import { HTML_SNIPPETS } from "../languages/htmlKnowledge";
import type { CompletionItem } from "../snippetsData";

const service = getLanguageService({
  customDataProviders: [
    newHTMLDataProvider("editor-markup", {
      version: 1.1,
      tags: MARKUP_TAGS.map(({ name }) => ({ name, attributes: [] })),
    }),
  ],
});

export const getHtmlCompletions = (
  code: string,
  cursor: number,
  filepath: string
): { word: string; items: CompletionItem[] } => {
  const before = code.slice(0, cursor);
  const abbreviation = /(?:^|\s)(!|html:5)$/.exec(before)?.[1];
  const snippet = HTML_SNIPPETS.find((entry) => entry.prefix === abbreviation);
  if (snippet && getMarkupContext(before, filepath).mode === "text")
    return {
      word: snippet.prefix,
      items: [
        {
          prefix: snippet.prefix,
          label: snippet.label,
          detail: snippet.detail,
          kind: "snippet",
          insertText: snippet.prefix,
          snippet,
          replaceStart: cursor - snippet.prefix.length,
          replaceEnd: cursor,
          score: 150,
        },
      ],
    };

  const document = TextDocument.create(`file:///${filepath}`, "html", 1, code);
  const completions = service.doComplete(
    document,
    document.positionAt(cursor),
    service.parseHTMLDocument(document)
  );
  const items: CompletionItem[] = [];
  let word = "";
  for (const item of completions.items) {
    if (!TextEdit.is(item.textEdit)) continue;
    const start = document.offsetAt(item.textEdit.range.start);
    const end = document.offsetAt(item.textEdit.range.end);
    const query = code.slice(start, cursor);
    const { match, score } = fuzzyMatch(item.filterText ?? item.label, query);
    if (!match) continue;
    word = query;
    const source = item.textEdit.newText;
    let cursorOffset: number | undefined;
    const insertText = source.replace(
      /\$\{\d+:([^}]*)\}|\$\d+/g,
      (_match: string, placeholder: string | undefined, offset: number): string => {
        if (cursorOffset === undefined) cursorOffset = offset;
        return placeholder ?? "";
      }
    );
    const description = item.documentation;
    const detail = typeof description === "string" ? description : (description?.value ?? "HTML");
    items.push({
      prefix: item.label,
      label: item.kind === CompletionItemKind.Property ? `<${item.label}>` : item.label,
      detail: detail.split("\n\n")[0],
      kind: item.kind === CompletionItemKind.Property ? "keyword" : "property",
      insertText,
      cursorOffset,
      replaceStart: start,
      replaceEnd: end,
      score: score + (query === "" && item.label === "div" ? 1 : 0),
    });
  }
  items.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  return { word, items: items.slice(0, 24) };
};
