import React, { useEffect } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { clsx } from "clsx";
import { Button } from "@/shared/ui";
import { FEATURE_LINKS, LANDING_SECTION, REPOSITORY_URL } from "../../config/landingLinks";
import styles from "./LandingNav.module.css";

export interface LandingMobileMenuProps {
  isOpen: boolean;
  onNavigate: () => void;
  onStartSignUp: () => void;
}

export const LandingMobileMenu = ({
  isOpen,
  onNavigate,
  onStartSignUp,
}: LandingMobileMenuProps): React.JSX.Element => {
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <div className={clsx(styles.sheet, isOpen && styles.sheetOpen)} inert={!isOpen}>
      <nav className={styles.sheetNav} aria-label="Меню лендинга">
        {FEATURE_LINKS.map((link) => (
          <a
            key={link.sectionId}
            className={styles.sheetLink}
            href={`#${link.sectionId}`}
            onClick={onNavigate}
          >
            {link.label}
            <span className={styles.sheetHint}>{link.description}</span>
          </a>
        ))}
        <a className={styles.sheetLink} href={`#${LANDING_SECTION.catalog}`} onClick={onNavigate}>
          Каталог задач
        </a>
        <a
          className={styles.sheetLink}
          href={REPOSITORY_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </nav>
      <Button
        variant="primary"
        size="xl"
        className={styles.sheetCta}
        rightIcon={<ArrowRight size={18} />}
        onClick={onStartSignUp}
      >
        Начать практику
      </Button>
    </div>
  );
};
