import { useEffect, useState, type RefObject } from "react";
import type { Editor } from "@tiptap/core";
import type { BlockTarget } from "../lib/blockActions";
import { findBlockAt } from "../lib/blockPosition";

const isSameBlock = (a: BlockTarget | null, b: BlockTarget): boolean =>
  a !== null && a.pos === b.pos && a.node === b.node;

/**
 * The block on the pointer's row, found from the pointer alone, so the handle follows the pointer
 * through the gutter and never sticks to the previous block. Hidden when the pointer leaves the
 * page or the text changes; frozen while `isLocked`.
 */
export const useHoveredBlock = (
  editor: Editor,
  pageRef: RefObject<HTMLElement | null>,
  isLocked: boolean
): BlockTarget | null => {
  const [hovered, setHovered] = useState<BlockTarget | null>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page || isLocked) return undefined;

    let frame = 0;
    const handleMouseMove = (event: MouseEvent): void => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = findBlockAt(editor, event.clientY, { isStrict: true });
        setHovered((current) => (next && isSameBlock(current, next) ? current : next));
      });
    };
    const hide = (): void => {
      cancelAnimationFrame(frame);
      setHovered(null);
    };

    page.addEventListener("mousemove", handleMouseMove);
    page.addEventListener("mouseleave", hide);
    editor.on("update", hide);
    return (): void => {
      cancelAnimationFrame(frame);
      page.removeEventListener("mousemove", handleMouseMove);
      page.removeEventListener("mouseleave", hide);
      editor.off("update", hide);
    };
  }, [editor, pageRef, isLocked]);

  return hovered;
};
