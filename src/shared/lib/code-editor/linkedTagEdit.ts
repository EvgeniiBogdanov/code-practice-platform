import { getLanguageCapabilities, getLanguageId } from "./languages/languageDetector";
import { getMarkupContext, type MarkupEdit } from "./markupContext";

export const getLinkedTagEdit = (
  previousCode: string,
  code: string,
  cursor: number,
  filepath: string
): MarkupEdit | null => {
  const capabilities = getLanguageCapabilities(getLanguageId(filepath));
  if (!capabilities.supportsHtmlTags || previousCode === code) return null;

  let start = 0;
  while (
    previousCode[start] === code[start] &&
    start < previousCode.length &&
    start < code.length
  ) {
    start++;
  }
  let previousEnd = previousCode.length;
  let nextEnd = code.length;
  while (
    previousEnd > start &&
    nextEnd > start &&
    previousCode[previousEnd - 1] === code[nextEnd - 1]
  ) {
    previousEnd--;
    nextEnd--;
  }

  const candidateStart = previousCode.lastIndexOf("<", start);
  if (candidateStart < 0 || previousCode.lastIndexOf(">", start - 1) > candidateStart) return null;
  const candidateName = /^<([\w$.:-]*)/.exec(previousCode.slice(candidateStart))?.[1];
  if (
    candidateName === undefined ||
    start < candidateStart + 1 ||
    previousEnd > candidateStart + 1 + candidateName.length
  )
    return null;

  const previousTags = getMarkupContext(previousCode, filepath).tags;
  const openingIndex = previousTags.findIndex((tag) => {
    const nameStart = tag.start + 1;
    const nameEnd = nameStart + tag.name.length;
    return (
      !tag.closing &&
      !tag.selfClosing &&
      start >= nameStart &&
      start <= nameEnd &&
      previousEnd <= nameEnd
    );
  });
  if (openingIndex < 0) return null;
  const opening = previousTags[openingIndex];
  const updated = getMarkupContext(code, filepath).tags.find(
    (tag) => tag.start === opening.start && !tag.closing && !tag.selfClosing
  );
  if (!updated || updated.name === opening.name) return null;

  const sameName = (left: string, right: string): boolean =>
    capabilities.supportsJsx ? left === right : left.toLowerCase() === right.toLowerCase();
  const hasFragmentAncestor =
    capabilities.supportsJsx &&
    getMarkupContext(previousCode.slice(0, opening.start), filepath).openTags.includes("");
  const stack = [opening];
  for (const tag of previousTags.slice(openingIndex + 1)) {
    if (!tag.closing) {
      if (!tag.selfClosing) stack.push(tag);
      continue;
    }
    const current = stack.at(-1);
    if (!current || (tag.name ? !sameName(tag.name, current.name) : hasFragmentAncestor)) {
      continue;
    }
    stack.pop();
    if (current !== opening) continue;
    const closingNameStart = tag.start + 2 + code.length - previousCode.length;
    return {
      newCode:
        code.slice(0, closingNameStart) +
        updated.name +
        code.slice(closingNameStart + tag.name.length),
      newCursor: cursor,
    };
  }
  return null;
};
