import { useEffect, useLayoutEffect, useRef, useState, type JSX, type RefObject } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
} from "@dnd-kit/core";
import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import type { BlockTarget } from "../../lib/blockActions";
import { getDropSlot, moveBlock, type DropSlot } from "../../lib/blockMove";
import { findBlockAt, getBlockDom, measureBlock } from "../../lib/blockPosition";
import { markDragSource } from "../../lib/dragSource";
import { markBlockMenuOpenedByButton } from "../BlockMenu/blockMenuExtension";
import { useHoveredBlock } from "../../model/useHoveredBlock";
import { BlockPreview } from "./BlockPreview";
import { HandleBar } from "./HandleBar";
import styles from "./BlockHandle.module.css";

/** The pointer has to travel this far (px) before a press on the grip becomes a drag and not a click. */
const DRAG_DISTANCE = 5;
const HANDLE_GAP = 4;
/** Dragging is pointer-only; the menu behind the grip and Ctrl/⌘+Shift+↑/↓ cover the keyboard. */
const SCREEN_READER_INSTRUCTIONS = {
  draggable:
    "Перетаскивание блока работает мышью. С клавиатуры откройте меню блока или переместите блок сочетанием Ctrl или Command плюс Shift плюс стрелка вверх или вниз.",
};

interface BlockHandleProps {
  editor: Editor;
  /** The page the handle floats in: its pointer movements pick the hovered block. */
  pageRef: RefObject<HTMLElement | null>;
  /** Keeps the handle on its block, e.g. while a menu hangs from it. */
  isLocked: boolean;
  onOpenMenu: (target: BlockTarget, anchor: DOMRect) => void;
}

interface DropLine {
  top: number;
  left: number;
  width: number;
}

/**
 * Notion's left gutter. "+" on an empty line opens the "/" menu there; the grip opens the block
 * menu on click and drags the block on press-and-move, with a line showing where it will land.
 */
export const BlockHandle = ({
  editor,
  pageRef,
  isLocked,
  onOpenMenu,
}: BlockHandleProps): JSX.Element => {
  const barRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const pointerY = useRef(0);
  const [dragged, setDragged] = useState<BlockTarget | null>(null);
  const [slot, setSlot] = useState<DropSlot | null>(null);

  const hovered = useHoveredBlock(editor, pageRef, isLocked || dragged !== null);
  const active = dragged ?? hovered;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: DRAG_DISTANCE } })
  );

  // Follows typing: the "+" disappears as soon as the line gets text.
  const canAddBlock = useEditorState({
    editor,
    selector: ({ editor: current }): boolean => {
      const node = hovered ? current.state.doc.nodeAt(hovered.pos) : null;
      return node?.type.name === "paragraph" && node.content.size === 0;
    },
  });

  // Centre the buttons on the block's first line, left of its bullet or quote bar.
  useLayoutEffect(() => {
    const bar = barRef.current;
    const page = pageRef.current;
    const metrics = active ? measureBlock(editor, active) : null;
    if (!bar || !page || !metrics) return;
    const pageRect = page.getBoundingClientRect();
    const left =
      metrics.rect.left - metrics.markerWidth - bar.offsetWidth - HANDLE_GAP - pageRect.left;
    const top =
      metrics.rect.top +
      metrics.paddingTop +
      (metrics.lineHeight - bar.offsetHeight) / 2 -
      pageRect.top;
    bar.style.setProperty("--handle-left", `${left}px`);
    bar.style.setProperty("--handle-top", `${top}px`);
  }, [editor, pageRef, active]);

  // Draw the drop line against the block the slot is anchored to.
  useLayoutEffect(() => {
    const line = indicatorRef.current;
    const page = pageRef.current;
    const metrics = slot ? measureBlock(editor, slot.anchor) : null;
    if (!line || !page || !slot || !metrics) return;
    const pageRect = page.getBoundingClientRect();
    const place = (target: DropLine): void => {
      line.style.setProperty("--line-top", `${target.top}px`);
      line.style.setProperty("--line-left", `${target.left}px`);
      line.style.setProperty("--line-width", `${target.width}px`);
    };
    place({
      top: (slot.placeAfter ? metrics.rect.bottom : metrics.rect.top) - pageRect.top,
      left: metrics.rect.left - metrics.markerWidth - pageRect.left,
      width: metrics.rect.width + metrics.markerWidth,
    });
  }, [editor, pageRef, slot]);

  useEffect(() => {
    if (!dragged) return undefined;
    const track = (event: PointerEvent): void => {
      pointerY.current = event.clientY;
    };
    window.addEventListener("pointermove", track);
    return (): void => window.removeEventListener("pointermove", track);
  }, [dragged]);

  const handleDragStart = ({ activatorEvent }: DragStartEvent): void => {
    if (!hovered) return;
    pointerY.current = activatorEvent instanceof PointerEvent ? activatorEvent.clientY : 0;
    setDragged(hovered);
    markDragSource(editor, hovered);
  };

  const handleDragMove = (): void => {
    const target = dragged ? findBlockAt(editor, pointerY.current, { isStrict: false }) : null;
    const dom = target ? getBlockDom(editor, target) : null;
    if (!dragged || !target || !dom) {
      setSlot(null);
      return;
    }
    const { top, height } = dom.getBoundingClientRect();
    setSlot(getDropSlot(editor.state.doc, dragged, target, pointerY.current > top + height / 2));
  };

  const finishDrag = (): void => {
    markDragSource(editor, null);
    setDragged(null);
    setSlot(null);
  };

  const handleDragEnd = (): void => {
    if (dragged && slot) moveBlock(editor, dragged, slot);
    finishDrag();
  };

  return (
    <DndContext
      sensors={sensors}
      accessibility={{ screenReaderInstructions: SCREEN_READER_INSTRUCTIONS }}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragCancel={finishDrag}
    >
      <HandleBar
        ref={barRef}
        isVisible={active !== null}
        canAddBlock={canAddBlock && dragged === null}
        onAddBlock={(): void => {
          if (!hovered) return;
          markBlockMenuOpenedByButton(editor);
          editor
            .chain()
            .focus()
            .setTextSelection(hovered.pos + 1)
            .insertContent("/")
            .run();
        }}
        onOpenMenu={(anchor): void => {
          if (hovered) onOpenMenu(hovered, anchor);
        }}
      />
      {slot && <div ref={indicatorRef} className={styles.dropLine} aria-hidden="true" />}
      {createPortal(
        <DragOverlay dropAnimation={null}>
          {dragged && <BlockPreview editor={editor} block={dragged} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};
