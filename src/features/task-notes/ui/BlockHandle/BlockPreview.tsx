import { useMemo, type JSX } from "react";
import DOMPurify from "dompurify";
import type { Editor } from "@tiptap/core";
import { markdownContentClass } from "@/shared/ui";
import { toHtml, type BlockTarget } from "../../lib/blockActions";
import { isListItem } from "../../lib/blockPosition";
import { notePaletteClass } from "../noteColors";
import styles from "./BlockHandle.module.css";

interface BlockPreviewProps {
  editor: Editor;
  block: BlockTarget;
}

/** The ghost that follows the pointer while a block is dragged. */
export const BlockPreview = ({ editor, block }: BlockPreviewProps): JSX.Element => {
  const html = useMemo(() => {
    const markup = DOMPurify.sanitize(toHtml(editor, block.node));
    // A lone list item has no list around it to draw its bullet.
    return isListItem(block.node) ? `<ul>${markup}</ul>` : markup;
  }, [editor, block]);

  return (
    <div
      className={`${styles.preview} ${markdownContentClass} ${notePaletteClass}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
