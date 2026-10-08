import { Fragment, type Node } from "@tiptap/pm/model";
import { LANGUAGE_MAP } from "@/shared/ui";

/** `language-js`, `lang-js`, `highlight-source-js`, `brush: js`, as sites mark their code blocks. */
const CLASS_PATTERN = /(?:^|\s)(?:language|lang|highlight-source|brush:?)[-\s]+([\w+#]+)/i;
const LABEL_PATTERN = /^[A-Za-z][\w+#]{0,15}$/;

/** A word that names a language the code window knows (`js`, `JSON`, `bash`), or null. */
export const toKnownLanguage = (word: string): string | null => {
  const language = word.trim().toLowerCase();
  return LABEL_PATTERN.test(language) && language in LANGUAGE_MAP ? language : null;
};

/** The language a pasted `<pre>` was marked with, looked up on the block and the wrappers around it. */
export const detectCodeLanguage = (pre: HTMLElement): string | null => {
  const code = pre.querySelector("code");
  const marked = [pre, code, pre.parentElement, pre.parentElement?.parentElement];
  for (const element of marked) {
    const explicit = element?.getAttribute("data-language") ?? element?.getAttribute("data-lang");
    if (explicit) return explicit.trim().toLowerCase();
  }
  for (const element of marked) {
    const match = CLASS_PATTERN.exec(element?.getAttribute("class") ?? "");
    if (match) return match[1].toLowerCase();
  }
  return null;
};

/**
 * Pages draw a code block's language as a small label above it, which arrives as a paragraph
 * holding just that word. When such a paragraph sits right before a code block without a
 * language, the label becomes the block's language instead of text in the note.
 */
export const applyCodeLanguageLabels = (content: Fragment): Fragment => {
  const blocks: Node[] = [];
  for (let index = 0; index < content.childCount; index += 1) {
    const child = content.child(index);
    const next = content.maybeChild(index + 1);
    const label = child.type.name === "paragraph" ? toKnownLanguage(child.textContent) : null;

    if (label && next?.type.name === "codeBlock" && !next.attrs.language) {
      blocks.push(next.type.create({ ...next.attrs, language: label }, next.content));
      index += 1; // the label and the block are one block now
    } else {
      blocks.push(
        child.isTextblock || child.isLeaf
          ? child
          : child.copy(applyCodeLanguageLabels(child.content))
      );
    }
  }
  return Fragment.fromArray(blocks);
};
