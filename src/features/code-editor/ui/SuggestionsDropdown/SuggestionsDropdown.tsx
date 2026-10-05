import React, { useEffect, useRef } from "react";
import { clsx } from "clsx";
import {
  Braces,
  Hash,
  KeyRound,
  Package,
  Shapes,
  Sparkles,
  SquareFunction,
  Tag,
  Variable,
  type LucideIcon,
} from "lucide-react";
import { UiKbd } from "@/shared/ui";
import { CompletionItem, fuzzyScore } from "@/shared/lib/code-editor";
import { getSuggestionOptionId } from "../../lib/suggestionOptionId";
import { describeCompletionKind, type CompletionIcon } from "../../lib/completionKind";
import styles from "./SuggestionsDropdown.module.css";

export interface SuggestionsDropdownProps {
  /** Id of the listbox; the editor points `aria-controls` at it. */
  id?: string;
  items: CompletionItem[];
  /** Typed word: its matched letters are highlighted in each label, as in VS Code. */
  query?: string;
  selectedIndex: number;
  position: {
    top: number;
    left: number;
    placement?: "top" | "bottom";
    maxHeight?: number;
  };
  onSelect: (item: CompletionItem) => void;
  className?: string;
}

const ICONS: Record<CompletionIcon, LucideIcon> = {
  function: SquareFunction,
  variable: Variable,
  property: Braces,
  type: Shapes,
  keyword: KeyRound,
  snippet: Sparkles,
  module: Package,
  tag: Tag,
  symbol: Hash,
};

const highlightMatches = (label: string, query: string): React.ReactNode => {
  const matches = new Set(fuzzyScore(label, query)?.matches);
  if (matches.size === 0) return label;
  return Array.from(label, (char, index) =>
    matches.has(index) ? (
      <mark key={index} className={styles.match}>
        {char}
      </mark>
    ) : (
      char
    )
  );
};

export function SuggestionsDropdown({
  id,
  items,
  query = "",
  selectedIndex,
  position,
  onSelect,
  className,
}: SuggestionsDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.top = `${position.top}px`;
      containerRef.current.style.left = `${position.left}px`;
      if (position.placement === "top") {
        containerRef.current.style.transform = "translateY(-100%)";
      } else {
        containerRef.current.style.transform = "none";
      }
      if (position.maxHeight) {
        containerRef.current.style.maxHeight = `${position.maxHeight}px`;
      } else {
        containerRef.current.style.maxHeight = "";
      }
    }
  }, [position.top, position.left, position.placement, position.maxHeight]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const selectedEl = el.children[selectedIndex] as HTMLElement | undefined;
    if (selectedEl && typeof selectedEl.scrollIntoView === "function") {
      selectedEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (items.length === 0) return null;

  const selected = items[selectedIndex];
  const selectedKind = describeCompletionKind(selected?.kind);

  return (
    <div
      ref={containerRef}
      data-placement={position.placement ?? "bottom"}
      className={clsx(styles.dropdown, className)}
      onMouseDown={(e) => {
        // Prevent clicking inside dropdown container from blurring textarea
        e.preventDefault();
      }}
    >
      <div className={styles.surface}>
        <div ref={listRef} id={id} role="listbox" aria-label="Подсказки" className={styles.list}>
          {items.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            const kind = describeCompletionKind(item.autoImport ? "import" : item.kind);
            const Icon = ICONS[kind.icon];
            return (
              <div
                key={`${item.label}-${idx}`}
                id={id ? getSuggestionOptionId(id, idx) : undefined}
                role="option"
                aria-selected={isSelected}
                className={clsx(styles.item, isSelected && styles.selected)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect(item);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  onSelect(item);
                }}
              >
                <span
                  className={clsx(styles.badge, styles[`tone_${kind.tone}`])}
                  aria-hidden="true"
                >
                  <Icon size={12} strokeWidth={2.2} />
                </span>
                <span className={styles.label}>{highlightMatches(item.label, query)}</span>
                {item.autoImport ? (
                  <span className={styles.source}>{item.autoImport.module}</span>
                ) : (
                  <span className={styles.kind}>{kind.label}</span>
                )}
              </div>
            );
          })}
        </div>
        <div className={styles.footer} aria-hidden="true">
          <span className={styles.detail}>{selected?.detail || selectedKind.label}</span>
          <span className={styles.hints}>
            <UiKbd keys={["↑", "↓"]} size="sm" />
            <UiKbd keys={["Tab"]} size="sm" />
          </span>
        </div>
      </div>
    </div>
  );
}
