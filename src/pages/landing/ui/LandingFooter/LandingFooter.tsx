import React from "react";
import { ArrowUpRight } from "lucide-react";
import { CURRICULUM_COUNTS, SECTIONS_CONFIG, type SectionType } from "@/entities/task/meta";
import { APP_VERSION } from "@/shared/config";
import { PlatformLogo } from "@/shared/ui";
import { FEATURE_LINKS, LANDING_SECTION, PROJECT_LINKS } from "../../config/landing-links";
import { TOTAL_TASK_COUNT, formatTaskCount } from "../../lib/format-task-count";
import styles from "./LandingFooter.module.css";

const SECTION_ORDER: readonly SectionType[] = ["javascript", "typescript", "react", "algorithms"];

export const LandingFooter = (): React.JSX.Element => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <div className={styles.top}>
        <div className={styles.brandBlock}>
          <a className={styles.brand} href="#top">
            <PlatformLogo size={24} />
            CodePractice
          </a>
          <p className={styles.tagline}>
            Тренажёр frontend-собеседований: {formatTaskCount(TOTAL_TASK_COUNT)}, редактор уровня
            IDE, эталонные решения и интервальные повторения.
          </p>
        </div>

        <nav className={styles.columns} aria-label="Ссылки в подвале">
          <div>
            <h2 className={styles.columnTitle}>Разделы</h2>
            <ul className={styles.links}>
              {SECTION_ORDER.map((id) => (
                <li key={id}>
                  <a href={`#${LANDING_SECTION.catalog}`}>
                    {SECTIONS_CONFIG[id].title}
                    <span className={styles.count}>{CURRICULUM_COUNTS[id]}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={styles.columnTitle}>Возможности</h2>
            <ul className={styles.links}>
              {FEATURE_LINKS.map((link) => (
                <li key={link.sectionId}>
                  <a href={`#${link.sectionId}`}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={styles.columnTitle}>Проект</h2>
            <ul className={styles.links}>
              {PROJECT_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className={styles.bottom}>
        <p>
          © {new Date().getFullYear()} Code Practice Platform · v{APP_VERSION}
        </p>
        <p>Source-Available Non-Commercial License</p>
      </div>
    </div>
  </footer>
);
