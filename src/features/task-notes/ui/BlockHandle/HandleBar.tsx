import type { JSX, MouseEvent, Ref } from "react";
import { clsx } from "clsx";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical, Plus } from "lucide-react";
import styles from "./BlockHandle.module.css";

interface HandleBarProps {
  isVisible: boolean;
  canAddBlock: boolean;
  onAddBlock: () => void;
  onOpenMenu: (anchor: DOMRect) => void;
  ref?: Ref<HTMLDivElement>;
}

/** The "+" and the grip; the grip is the draggable. */
export const HandleBar = ({
  isVisible,
  canAddBlock,
  onAddBlock,
  onOpenMenu,
  ref,
}: HandleBarProps): JSX.Element => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: "note-block-handle" });

  return (
    <div ref={ref} className={clsx(styles.bar, isVisible && styles.visible)}>
      {canAddBlock && (
        <button
          type="button"
          className={styles.button}
          aria-label="Добавить блок"
          onClick={onAddBlock}
        >
          <Plus size={16} />
        </button>
      )}
      <button
        ref={setNodeRef}
        type="button"
        className={clsx(styles.button, styles.grip)}
        aria-label="Меню блока"
        aria-haspopup="menu"
        {...attributes}
        {...listeners}
        onClick={(event: MouseEvent<HTMLButtonElement>): void =>
          onOpenMenu(event.currentTarget.getBoundingClientRect())
        }
      >
        <GripVertical size={16} />
      </button>
    </div>
  );
};
