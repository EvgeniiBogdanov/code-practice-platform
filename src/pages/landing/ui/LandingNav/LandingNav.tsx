import React, { useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import { Button, PlatformLogo } from "@/shared/ui";
import { FEATURE_LINKS, LANDING_SECTION, REPOSITORY_URL } from "../../config/landingLinks";
import { useScrollDirection } from "../../lib/useScrollDirection";
import { useCreateAccountDialog } from "../../model/createAccountDialog";
import { LandingMobileMenu } from "./LandingMobileMenu";
import styles from "./LandingNav.module.css";

const FEATURES_MENU_ID = "landing-features-menu";

export const LandingNav = (): React.JSX.Element => {
  const { isScrolled, isHidden } = useScrollDirection();
  const openDialog = useCreateAccountDialog((state) => state.open);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== "Escape") return;
      setIsFeaturesOpen(false);
      setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const closeMenus = (): void => {
    setIsFeaturesOpen(false);
    setIsMobileMenuOpen(false);
  };

  const startSignUp = (): void => {
    closeMenus();
    openDialog();
  };

  return (
    <>
      <header
        className={clsx(
          styles.header,
          (isScrolled || isMobileMenuOpen) && styles.scrolled,
          isHidden && !isFeaturesOpen && !isMobileMenuOpen && styles.hidden
        )}
      >
        <div className={styles.bar}>
          <a className={styles.brand} href="#top" aria-label="Code Practice Platform — в начало">
            <PlatformLogo size={26} />
            <span>CodePractice</span>
          </a>

          <nav className={styles.nav} aria-label="Навигация по лендингу">
            <div
              className={clsx(styles.dropdown, isFeaturesOpen && styles.dropdownOpen)}
              onMouseLeave={() => setIsFeaturesOpen(false)}
            >
              <button
                type="button"
                className={styles.navLink}
                aria-expanded={isFeaturesOpen}
                aria-controls={FEATURES_MENU_ID}
                onClick={() => setIsFeaturesOpen((isOpen) => !isOpen)}
              >
                Возможности
                <ChevronDown size={14} className={styles.chevron} aria-hidden="true" />
              </button>
              <div id={FEATURES_MENU_ID} className={styles.menu}>
                {FEATURE_LINKS.map((link) => (
                  <a
                    key={link.sectionId}
                    className={styles.menuItem}
                    href={`#${link.sectionId}`}
                    onClick={(event) => {
                      // Drop focus so `:focus-within` stops holding the menu open.
                      event.currentTarget.blur();
                      closeMenus();
                    }}
                  >
                    <span className={styles.menuTitle}>{link.label}</span>
                    <span className={styles.menuDescription}>{link.description}</span>
                  </a>
                ))}
              </div>
            </div>
            <a className={styles.navLink} href={`#${LANDING_SECTION.catalog}`}>
              Каталог задач
            </a>
            <a className={styles.navLink} href={`#${LANDING_SECTION.start}`}>
              Как начать
            </a>
            <a
              className={styles.navLink}
              href={REPOSITORY_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </nav>

          <div className={styles.actions}>
            <Button variant="primary" className={styles.cta} onClick={startSignUp}>
              Начать практику
            </Button>
            <button
              type="button"
              className={clsx(styles.burger, isMobileMenuOpen && styles.burgerOpen)}
              aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Outside the header: its backdrop-filter would become the containing block. */}
      <LandingMobileMenu
        isOpen={isMobileMenuOpen}
        onNavigate={closeMenus}
        onStartSignUp={startSignUp}
      />
    </>
  );
};
