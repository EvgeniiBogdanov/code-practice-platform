import React, { useEffect, useRef } from "react";
import { clsx } from "clsx";
import { CompletionItem } from "@/shared/lib/code-editor";
import styles from "./SuggestionsDropdown.module.css";

export interface SuggestionsDropdownProps {
  items: CompletionItem[];
  selectedIndex: number;
  position: { top: number; left: number };
  onSelect: (item: CompletionItem) => void;
  className?: string;
}

export function SuggestionsDropdown({
  items,
  selectedIndex,
  position,
  onSelect,
  className,
}: SuggestionsDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.top = `${position.top}px`;
      containerRef.current.style.left = `${position.left}px`;
    }
  }, [position.top, position.left]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const selectedEl = el.children[selectedIndex] as HTMLElement | undefined;
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (items.length === 0) return null;

  return (
    <div ref={containerRef} className={clsx(styles.dropdown, className)}>
      {items.map((item, idx) => {
        const isSelected = idx === selectedIndex;
        return (
          <div
            key={`${item.label}-${idx}`}
            className={clsx(styles.item, isSelected && styles.selected)}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(item);
            }}
          >
            <span className={styles.label}>{item.label}</span>
            <span className={styles.kind}>{item.kind || "snippet"}</span>
          </div>
        );
      })}
    </div>
  );
}
