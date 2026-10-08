import { useEffect, useImperativeHandle, useRef, useState, type JSX, type Ref } from "react";
import { clsx } from "clsx";
import type { BlockItem } from "../../lib/blockItems";
import styles from "./BlockMenu.module.css";

export interface BlockMenuHandle {
  /** Returns true when the key was consumed by the menu. */
  onKeyDown: (event: KeyboardEvent) => boolean;
}

interface BlockMenuProps {
  items: readonly BlockItem[];
  onSelect: (item: BlockItem) => void;
  heading?: string;
  ref?: Ref<BlockMenuHandle>;
}

/** Notion-style "turn this line into…" list, driven by the "/" suggestion. */
export const BlockMenu = ({
  items,
  onSelect,
  heading = "Блоки",
  ref,
}: BlockMenuProps): JSX.Element => {
  const [selected, setSelected] = useState(0);
  const [knownItems, setKnownItems] = useState(items);
  const activeRef = useRef<HTMLButtonElement>(null);

  // A new query means a new list: start from its first entry again.
  if (items !== knownItems) {
    setKnownItems(items);
    setSelected(0);
  }

  useEffect(() => {
    activeRef.current?.scrollIntoView?.({ block: "nearest" });
  }, [selected, items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: (event): boolean => {
      if (items.length === 0) return false;
      if (event.key === "ArrowDown") {
        setSelected((current) => (current + 1) % items.length);
        return true;
      }
      if (event.key === "ArrowUp") {
        setSelected((current) => (current - 1 + items.length) % items.length);
        return true;
      }
      if (event.key === "Enter" || event.key === "Tab") {
        onSelect(items[Math.min(selected, items.length - 1)]);
        return true;
      }
      return false;
    },
  }));

  return (
    <div className={styles.menu} role="listbox" aria-label="Тип блока">
      <p className={styles.heading}>{heading}</p>
      {items.length === 0 && <p className={styles.empty}>Ничего не найдено</p>}
      {items.map((item, index) => {
        const Icon = item.icon;
        const isActive = index === selected;
        return (
          <button
            key={item.id}
            ref={isActive ? activeRef : undefined}
            type="button"
            role="option"
            aria-selected={isActive}
            className={clsx(styles.item, isActive && styles.active)}
            // Keep focus (and the selection) in the editor.
            onMouseDown={(event): void => event.preventDefault()}
            onMouseEnter={(): void => setSelected(index)}
            onClick={(): void => onSelect(item)}
          >
            <span className={styles.icon}>
              <Icon size={18} />
            </span>
            <span className={styles.text}>
              <span className={styles.title}>{item.title}</span>
              <span className={styles.description}>{item.description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};
