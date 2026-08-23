import React, { useState, useRef, useEffect, memo } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, PanelLeftClose } from "lucide-react";
import { SECTIONS_CONFIG, SECTIONS_LIST, SectionType } from "@/entities/task";
import { Tooltip } from "@/shared/ui";
import styles from "./SidebarWorkspaceHeader.module.css";

export interface SidebarWorkspaceHeaderProps {
  activeSectionKey: "home" | SectionType;
  onCloseSidebar: () => void;
}

export const SidebarWorkspaceHeader = memo(
  ({ activeSectionKey, onCloseSidebar }: SidebarWorkspaceHeaderProps) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const activeSection = SECTIONS_CONFIG[activeSectionKey] || SECTIONS_CONFIG.home;
    const ActiveSectionIcon = activeSection.icon;

    // Close dropdown on click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close dropdown on Escape key
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setDropdownOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
      <div className={styles.header}>
        <div className={styles.workspaceInfoWrapper} ref={dropdownRef}>
          <Tooltip content="Выбрать раздел платформы" side="right" sideOffset={8} fullWidth>
            <button
              type="button"
              className={styles.workspaceInfoBtn}
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-label="Переключить раздел платформы"
            >
              <ActiveSectionIcon size={16} className={styles[`icon_${activeSection.id}`]} />
              <span>{activeSection.title}</span>
              <ChevronDown size={13} className={styles.sectionChevron} />
            </button>
          </Tooltip>

          {dropdownOpen && (
            <div className={styles.sectionDropdownMenu}>
              <div className={styles.sectionDropdownHeader}>Разделы платформы</div>
              {SECTIONS_LIST.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSectionKey === sec.id;
                return (
                  <Link
                    key={sec.id}
                    to={sec.path}
                    className={[styles.sectionDropdownItem, isActive && styles.activeDropdownItem]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Icon size={15} className={styles[`icon_${sec.id}`]} />
                    <span>{sec.title}</span>
                    <span className={styles.sectionBadge}>{sec.badge}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <Tooltip content="Свернуть боковую панель" side="right" sideOffset={8}>
          <button
            type="button"
            className={styles.sidebarToggleBtn}
            onClick={onCloseSidebar}
            aria-label="Свернуть боковую панель"
          >
            <PanelLeftClose size={15} />
          </button>
        </Tooltip>
      </div>
    );
  }
);

SidebarWorkspaceHeader.displayName = "SidebarWorkspaceHeader";
