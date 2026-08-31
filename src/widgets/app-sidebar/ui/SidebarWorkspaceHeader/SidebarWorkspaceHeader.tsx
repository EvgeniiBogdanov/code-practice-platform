import React, { useState, useRef, useEffect, memo, useMemo, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, PanelLeft, ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { clsx } from "clsx";
import {
  SECTIONS_CONFIG,
  SECTIONS_LIST,
  SectionType,
  JS_GROUP_CONFIG,
  ALGO_GROUP_CONFIG,
} from "@/entities/task";
import { useUIStore } from "@/entities/ui-state";
import { Tooltip, SquareButton } from "@/shared/ui";
import { SidebarFavorites } from "../SidebarFavorites/SidebarFavorites";
import styles from "./SidebarWorkspaceHeader.module.css";

export interface SidebarWorkspaceHeaderProps {
  activeSectionKey: "home" | SectionType;
  currentTaskId: string;
  onCloseSidebar: () => void;
}

export const SidebarWorkspaceHeader = memo(
  ({ activeSectionKey, currentTaskId, onCloseSidebar }: SidebarWorkspaceHeaderProps) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const activeSection = SECTIONS_CONFIG[activeSectionKey] || SECTIONS_CONFIG.home;
    const ActiveSectionIcon = activeSection.icon;

    const expandedJsGroups = useUIStore((state) => state.expandedJsGroups);
    const expandedAlgoGroups = useUIStore((state) => state.expandedAlgoGroups);
    const warmupExpanded = useUIStore((state) => state.warmupExpanded);
    const refactoringExpanded = useUIStore((state) => state.refactoringExpanded);
    const tasksExpanded = useUIStore((state) => state.tasksExpanded);
    const advancedExpanded = useUIStore((state) => state.advancedExpanded);
    const reactTsExpanded = useUIStore((state) => state.reactTsExpanded);
    const reactTsPracticeExpanded = useUIStore((state) => state.reactTsPracticeExpanded);

    const collapseAllInCurrentSection = useUIStore((state) => state.collapseAllInCurrentSection);
    const expandAllInCurrentSection = useUIStore((state) => state.expandAllInCurrentSection);

    const isAnyExpanded = useMemo(() => {
      if (activeSectionKey === "javascript") {
        return Object.values(expandedJsGroups || {}).some(Boolean);
      }
      if (activeSectionKey === "algorithms") {
        return Object.values(expandedAlgoGroups || {}).some(Boolean);
      }
      if (activeSectionKey === "react") {
        return Boolean(
          warmupExpanded ||
          refactoringExpanded ||
          tasksExpanded ||
          advancedExpanded ||
          reactTsExpanded ||
          reactTsPracticeExpanded
        );
      }
      return false;
    }, [
      activeSectionKey,
      expandedJsGroups,
      expandedAlgoGroups,
      warmupExpanded,
      refactoringExpanded,
      tasksExpanded,
      advancedExpanded,
      reactTsExpanded,
      reactTsPracticeExpanded,
    ]);

    const handleToggleExpandAll = useCallback(() => {
      if (activeSectionKey === "home") return;
      if (isAnyExpanded) {
        collapseAllInCurrentSection(activeSectionKey);
      } else {
        const groupNames =
          activeSectionKey === "javascript"
            ? Object.keys(JS_GROUP_CONFIG)
            : activeSectionKey === "algorithms"
              ? Object.keys(ALGO_GROUP_CONFIG)
              : [];
        expandAllInCurrentSection(activeSectionKey, groupNames);
      }
    }, [activeSectionKey, isAnyExpanded, collapseAllInCurrentSection, expandAllInCurrentSection]);

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
                    className={clsx(
                      styles.sectionDropdownItem,
                      isActive && styles.activeDropdownItem
                    )}
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

        <div className={styles.headerActions}>
          {activeSectionKey !== "home" && (
            <Tooltip
              content={isAnyExpanded ? "Свернуть все темы" : "Развернуть все темы"}
              side="bottom"
              sideOffset={6}
            >
              <SquareButton
                size="md"
                icon={isAnyExpanded ? <ChevronsDownUp size={15} /> : <ChevronsUpDown size={15} />}
                onClick={handleToggleExpandAll}
                aria-label={isAnyExpanded ? "Свернуть все темы" : "Развернуть все темы"}
              />
            </Tooltip>
          )}

          {activeSectionKey !== "home" && (
            <SidebarFavorites section={activeSectionKey} currentTaskId={currentTaskId} />
          )}

          <Tooltip content="Свернуть боковую панель" side="right" sideOffset={8}>
            <SquareButton
              size="md"
              icon={<PanelLeft size={15} />}
              onClick={onCloseSidebar}
              aria-label="Свернуть боковую панель"
            />
          </Tooltip>
        </div>
      </div>
    );
  }
);

SidebarWorkspaceHeader.displayName = "SidebarWorkspaceHeader";
