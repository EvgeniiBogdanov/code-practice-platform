/**
 * Splits highlighter markup into one balanced html string per source line.
 *
 * Tokens such as block comments or template literals span several lines: their tags are
 * closed at each line end and reopened on the next line, so every line renders on its own.
 * The highlighter escapes text, so every `<` in the markup starts a tag.
 */
const TEXT_RUN = /[^<\n]+/y;

export const splitHighlightedLines = (html: string): string[] => {
  const lines: string[] = [];
  const openTags: string[] = [];
  let line = "";
  let index = 0;

  while (index < html.length) {
    const char = html[index];
    if (char === "<") {
      const end = html.indexOf(">", index);
      const tag = html.slice(index, end + 1);
      if (tag.startsWith("</")) openTags.pop();
      else if (!tag.endsWith("/>")) openTags.push(tag);
      line += tag;
      index = end + 1;
      continue;
    }
    if (char === "\n") {
      lines.push(line + "</span>".repeat(openTags.length));
      line = openTags.join("");
      index++;
      continue;
    }
    TEXT_RUN.lastIndex = index;
    TEXT_RUN.test(html);
    const stop = TEXT_RUN.lastIndex;
    line += html.slice(index, stop);
    index = stop;
  }

  lines.push(line);
  return lines;
};
