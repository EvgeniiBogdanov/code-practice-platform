import { useState, type JSX } from "react";
import { clsx } from "clsx";
import { isNodeSelection, type Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  Bold,
  ChevronDown,
  Code,
  Italic,
  Link2,
  Strikethrough,
  Unlink,
  type LucideIcon,
} from "lucide-react";
import type { BlockColors } from "../../lib/blockActions";
import { ColorMenu, type ColorChoice } from "../ColorMenu/ColorMenu";
import { notePaletteClass } from "../noteColors";
import styles from "./SelectionToolbar.module.css";

interface MarkButton {
  mark: "bold" | "italic" | "strike" | "code";
  label: string;
  icon: LucideIcon;
  toggle: (editor: Editor) => void;
}

const MARK_BUTTONS: readonly MarkButton[] = [
  {
    mark: "bold",
    label: "Жирный",
    icon: Bold,
    toggle: (editor) => editor.chain().focus().toggleBold().run(),
  },
  {
    mark: "italic",
    label: "Курсив",
    icon: Italic,
    toggle: (editor) => editor.chain().focus().toggleItalic().run(),
  },
  {
    mark: "strike",
    label: "Зачёркнутый",
    icon: Strikethrough,
    toggle: (editor) => editor.chain().focus().toggleStrike().run(),
  },
  {
    mark: "code",
    label: "Код",
    icon: Code,
    toggle: (editor) => editor.chain().focus().toggleCode().run(),
  },
];

interface SelectionToolbarProps {
  editor: Editor;
}

/** Floating formatting bar shown over selected text, like Notion's. */
export const SelectionToolbar = ({ editor }: SelectionToolbarProps): JSX.Element => {
  const [isLinkFormOpen, setIsLinkFormOpen] = useState(false);
  const [href, setHref] = useState("");
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  // Like Notion, the colour button wears the colour picked last and offers it again in the menu.
  const [lastUsed, setLastUsed] = useState<ColorChoice | null>(null);

  const active = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      bold: current.isActive("bold"),
      italic: current.isActive("italic"),
      strike: current.isActive("strike"),
      code: current.isActive("code"),
      link: current.isActive("link"),
      colors: {
        color: current.getAttributes("noteColor").color ?? null,
        background: current.getAttributes("noteColor").background ?? null,
      } satisfies BlockColors,
    }),
  });

  const closeLinkForm = (): void => {
    setIsLinkFormOpen(false);
    setHref("");
  };

  const closeMenus = (): void => {
    closeLinkForm();
    setIsColorMenuOpen(false);
  };

  const applyColors = (colors: Partial<BlockColors>): void => {
    editor.chain().focus().setNoteColor(colors).run();
    const kind = "color" in colors ? "color" : "background";
    const name = colors[kind];
    if (name) setLastUsed({ kind, name });
    setIsColorMenuOpen(false);
  };

  const applyLink = (): void => {
    const url = href.trim();
    if (url) editor.chain().focus().setLink({ href: url }).run();
    closeLinkForm();
  };

  const handleLinkClick = (): void => {
    if (active.link) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    setIsLinkFormOpen(true);
  };

  return (
    <BubbleMenu
      editor={editor}
      className={styles.anchor}
      shouldShow={({ editor: current, state }): boolean =>
        !state.selection.empty &&
        !isNodeSelection(state.selection) &&
        !current.isActive("codeBlock") &&
        current.isEditable
      }
      options={{ placement: "top", onHide: closeMenus }}
    >
      <div className={clsx(styles.toolbar, notePaletteClass)}>
        {isLinkFormOpen ? (
          <input
            autoFocus
            className={styles.linkInput}
            aria-label="Адрес ссылки"
            placeholder="Вставьте ссылку и нажмите Enter"
            value={href}
            onChange={(event): void => setHref(event.target.value)}
            onKeyDown={(event): void => {
              if (event.key === "Enter") {
                event.preventDefault();
                applyLink();
              } else if (event.key === "Escape") {
                closeLinkForm();
                editor.commands.focus();
              }
            }}
          />
        ) : (
          <>
            {MARK_BUTTONS.map(({ mark, label, icon: Icon, toggle }) => (
              <button
                key={mark}
                type="button"
                className={clsx(styles.button, active[mark] && styles.active)}
                aria-label={label}
                aria-pressed={active[mark]}
                onMouseDown={(event): void => event.preventDefault()}
                onClick={(): void => toggle(editor)}
              >
                <Icon size={16} />
              </button>
            ))}
            <button
              type="button"
              className={clsx(styles.button, active.link && styles.active)}
              aria-label={active.link ? "Убрать ссылку" : "Добавить ссылку"}
              aria-pressed={active.link}
              onMouseDown={(event): void => event.preventDefault()}
              onClick={handleLinkClick}
            >
              {active.link ? <Unlink size={16} /> : <Link2 size={16} />}
            </button>
            <span className={styles.separator} aria-hidden="true" />
            <div className={styles.colorAnchor}>
              <button
                type="button"
                className={clsx(
                  styles.button,
                  styles.colorButton,
                  isColorMenuOpen && styles.active
                )}
                aria-label="Цвет"
                aria-haspopup="listbox"
                aria-expanded={isColorMenuOpen}
                onMouseDown={(event): void => event.preventDefault()}
                onClick={(): void => setIsColorMenuOpen((isOpen) => !isOpen)}
              >
                <span
                  className={styles.colorFace}
                  data-color={lastUsed?.kind === "color" ? lastUsed.name : undefined}
                  data-background={lastUsed?.kind === "background" ? lastUsed.name : undefined}
                >
                  A
                </span>
                <ChevronDown size={12} />
              </button>
              {isColorMenuOpen && (
                <div className={styles.colorMenu}>
                  <ColorMenu current={active.colors} lastUsed={lastUsed} onSelect={applyColors} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </BubbleMenu>
  );
};
