import { memo, type JSX, type ReactNode } from "react";
import { clsx } from "clsx";
import { getCardTabId } from "./cardTabId";
import styles from "./UiCardTabs.module.css";

export type CardTabAccent = "green" | "blue" | "yellow" | "purple" | "cyan" | "orange";

export interface CardTabItem {
  id: string;
  label: string;
  icon: ReactNode;
  /** Colour of the icon and of the line under the active tab. */
  accent: CardTabAccent;
}

export interface UiCardTabsProps {
  items: readonly CardTabItem[];
  activeId: string;
  onChange: (id: string) => void;
  ariaLabel: string;
  /** Id of the tab panel the tabs control; the caller renders the panel with this id. */
  panelId: string;
}

/** A strip of tabs for the top of a bordered card, the way the task page shows its sections. */
export const UiCardTabs = memo(
  ({ items, activeId, onChange, ariaLabel, panelId }: UiCardTabsProps): JSX.Element => (
    <div className={styles.strip} role="tablist" aria-label={ariaLabel}>
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={getCardTabId(panelId, item.id)}
            aria-controls={panelId}
            aria-selected={isActive}
            className={clsx(styles.tab, styles[item.accent], isActive && styles.active)}
            onClick={() => onChange(item.id)}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </button>
        );
      })}
    </div>
  )
);

UiCardTabs.displayName = "UiCardTabs";
