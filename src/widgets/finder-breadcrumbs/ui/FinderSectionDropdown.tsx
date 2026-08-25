import React from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import { SECTIONS_CONFIG, SECTIONS_LIST } from "@/entities/task";
import { FinderSectionDropdownProps } from "../model/types";
import styles from "./FinderBreadcrumbs.module.css";

export const FinderSectionDropdown = ({
  section,
  activeDropdown,
  toggleDropdown,
  closeAllDropdowns,
}: FinderSectionDropdownProps) => {
  const sectionMeta = SECTIONS_CONFIG[section] || SECTIONS_CONFIG.home;
  const SectionIcon = sectionMeta.icon;

  return (
    <div className={styles.dropdownWrapper}>
      <button
        type="button"
        className={clsx(
          styles.breadcrumbBtn,
          activeDropdown === "section" && styles.breadcrumbBtnActive
        )}
        onClick={() => toggleDropdown("section")}
        title="Переключить раздел практики"
        aria-label="Переключить раздел практики"
      >
        <SectionIcon size={15} className={styles[`icon_${section}`]} />
        <span className={styles.itemText}>{sectionMeta.title}</span>
        <ChevronDown size={13} className={styles.chevron} />
      </button>

      {activeDropdown === "section" && (
        <div className={styles.dropdownMenu}>
          <div className={styles.dropdownHeader}>РАЗДЕЛЫ ПЛАТФОРМЫ</div>
          <div className={styles.dropdownList}>
            {SECTIONS_LIST.map((sec) => {
              const Icon = sec.icon;
              const isActive = section === sec.id;
              return (
                <Link
                  key={sec.id}
                  to={sec.path}
                  className={clsx(styles.dropdownItem, isActive && styles.active)}
                  onClick={closeAllDropdowns}
                >
                  <Icon size={15} className={styles[`icon_${sec.id}`]} />
                  <span className={styles.dropdownItemTitle}>{sec.title}</span>
                  <span className={styles.sectionBadge}>{sec.badge}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
