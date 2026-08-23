import React, { useState, useRef } from "react";
import { clsx } from "clsx";
import { useOnClickOutside } from "../../lib/hooks";
import styles from "./Dropdown.module.css";

export interface DropdownItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
  dividerBefore?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({ trigger, items, align = "right", className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(containerRef, () => setIsOpen(false));

  return (
    <div ref={containerRef} className={clsx(styles.container, className)}>
      <div onClick={() => setIsOpen((prev) => !prev)}>{trigger}</div>
      {isOpen && (
        <div className={clsx(styles.menu, styles[`align-${align}`])}>
          {items.map((item) => (
            <React.Fragment key={item.id}>
              {item.dividerBefore && <div className={styles.divider} />}
              <button
                type="button"
                className={clsx(
                  styles.item,
                  item.active && styles.active,
                  item.danger && styles.danger
                )}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
