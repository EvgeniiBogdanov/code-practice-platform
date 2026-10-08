import { Mark } from "@tiptap/core";

export const NOTE_COLOR_NAMES = [
  "gray",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
  "red",
] as const;

export type NoteColorName = (typeof NOTE_COLOR_NAMES)[number];

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    noteColor: {
      /** Sets text and/or background colour of the selection; `null` clears that part. */
      setNoteColor: (colors: {
        color?: NoteColorName | null;
        background?: NoteColorName | null;
      }) => ReturnType;
    };
  }
}

const SPAN_PATTERN = /^<span((?: data-(?:color|background)="[a-z]+")+)>([\s\S]*?)<\/span>/;

const dataAttribute = (name: "color" | "background") => ({
  default: null,
  parseHTML: (element: HTMLElement): string | null => element.getAttribute(`data-${name}`),
  renderHTML: (attributes: Record<string, string | null>) =>
    attributes[name] ? { [`data-${name}`]: attributes[name] } : {},
});

/**
 * Text and background colour from a fixed palette. Markdown has no colours, so a coloured run
 * is stored as an inline `<span data-color="…" data-background="…">`, which plain markdown
 * renderers pass through and which degrades to ordinary text anywhere else.
 */
export const NoteColor = Mark.create({
  name: "noteColor",

  addAttributes() {
    return { color: dataAttribute("color"), background: dataAttribute("background") };
  },

  parseHTML() {
    return [{ tag: "span[data-color], span[data-background]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0];
  },

  markdownTokenizer: {
    name: "noteColor",
    level: "inline",
    start: (src: string): number => src.indexOf("<span data-"),
    tokenize: (src, _tokens, lexer) => {
      const match = SPAN_PATTERN.exec(src);
      if (!match) return undefined;
      const [raw, attributes, inner] = match;
      return {
        type: "noteColor",
        raw,
        text: inner,
        tokens: lexer.inlineTokens(inner),
        color: /data-color="([a-z]+)"/.exec(attributes)?.[1] ?? null,
        background: /data-background="([a-z]+)"/.exec(attributes)?.[1] ?? null,
      };
    },
  },

  parseMarkdown(token, helpers) {
    return helpers.applyMark(this.name, helpers.parseInline(token.tokens ?? []), {
      color: token.color ?? null,
      background: token.background ?? null,
    });
  },

  renderMarkdown(node, helpers) {
    const attrs = node.attrs ?? {};
    const parts = [
      attrs.color ? ` data-color="${attrs.color}"` : "",
      attrs.background ? ` data-background="${attrs.background}"` : "",
    ].join("");
    return `<span${parts}>${helpers.renderChildren(node)}</span>`;
  },

  addCommands() {
    return {
      setNoteColor:
        ({ color, background }) =>
        ({ editor, commands }) => {
          const current = editor.getAttributes(this.name);
          const next = {
            color: color === undefined ? (current.color ?? null) : color,
            background: background === undefined ? (current.background ?? null) : background,
          };
          return next.color || next.background
            ? commands.setMark(this.name, next)
            : commands.unsetMark(this.name);
        },
    };
  },
});
