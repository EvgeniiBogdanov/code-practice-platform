import { useRef, useState, type JSX } from "react";
import { clsx } from "clsx";
import { EditorContent, ReactNodeViewRenderer, useEditor } from "@tiptap/react";
import { markdownContentClass } from "@/shared/ui";
import { releaseBlockSelection, selectBlock, type BlockTarget } from "../../lib/blockActions";
import { createNoteExtensions } from "../../lib/noteExtensions";
import { BlockHandle } from "../BlockHandle/BlockHandle";
import { BlockActionsMenu } from "../BlockActionsMenu/BlockActionsMenu";
import { CodeBlockView } from "../CodeBlock/CodeBlockView";
import { BlockMenuExtension } from "../BlockMenu/blockMenuExtension";
import { notePaletteClass } from "../noteColors";
import { SelectionToolbar } from "../SelectionToolbar/SelectionToolbar";
import styles from "./NoteEditor.module.css";

export interface NoteEditorProps {
  /** Markdown the editor starts with; later changes are not pushed back in. */
  initialMarkdown: string;
  onChange: (markdown: string) => void;
  className?: string;
}

/** A Notion-like page: always rendered, edited in place, markdown underneath. */
export const NoteEditor = ({
  initialMarkdown,
  onChange,
  className,
}: NoteEditorProps): JSX.Element => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [blockMenu, setBlockMenu] = useState<{ target: BlockTarget; anchor: DOMRect } | null>(null);
  const [extensions] = useState(() =>
    createNoteExtensions({
      codeBlockView: ReactNodeViewRenderer(CodeBlockView),
      extra: [BlockMenuExtension],
    })
  );

  const editor = useEditor({
    extensions,
    content: initialMarkdown,
    contentType: "markdown",
    editorProps: {
      attributes: {
        class: clsx(markdownContentClass, notePaletteClass, styles.content),
        "aria-label": "Текст заметки",
        "aria-multiline": "true",
      },
      handleClick: (_view, _pos, event): boolean => {
        const link = event.target instanceof Element ? event.target.closest("a") : null;
        if (!link || !(event.metaKey || event.ctrlKey)) return false;
        window.open(link.href, "_blank", "noopener,noreferrer");
        return true;
      },
    },
    onUpdate: ({ editor: current }): void => onChange(current.getMarkdown().trimEnd()),
  });

  /** The grip next to a block opens that block's actions menu. */
  const handleOpenBlockMenu = (target: BlockTarget, anchor: DOMRect): void => {
    if (!editor) return;
    selectBlock(editor, target);
    setBlockMenu({ target, anchor });
  };

  const handleCloseBlockMenu = (): void => {
    setBlockMenu(null);
    if (editor) releaseBlockSelection(editor);
  };

  if (!editor) return <div ref={pageRef} className={clsx(styles.page, className)} />;

  return (
    <div ref={pageRef} className={clsx(styles.page, className)}>
      <BlockHandle
        editor={editor}
        pageRef={pageRef}
        isLocked={blockMenu !== null}
        onOpenMenu={handleOpenBlockMenu}
      />
      <SelectionToolbar editor={editor} />
      {blockMenu && (
        <BlockActionsMenu
          editor={editor}
          target={blockMenu.target}
          anchor={blockMenu.anchor}
          onClose={handleCloseBlockMenu}
        />
      )}
      <EditorContent editor={editor} className={styles.editor} />
    </div>
  );
};
