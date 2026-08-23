import React from "react";
import { AlertCircle, Lightbulb, Wand2 } from "lucide-react";
import { Tooltip } from "@/shared/ui";
import styles from "./QuickFixBanner.module.css";

export interface TypoProblem {
  line: number;
  typo: string;
  correct: string;
}

export interface MissingImportProblem {
  line: number;
  symbol: string;
  module: string;
  isDefault?: boolean;
}

export interface QuickFixBannerProps {
  activeTypo?: TypoProblem | null;
  activeMissingImport?: MissingImportProblem | null;
  onFixTypo?: (typo: TypoProblem) => void;
  onFixMissingImport?: (imp: MissingImportProblem) => void;
}

export function QuickFixBanner({
  activeTypo,
  activeMissingImport,
  onFixTypo,
  onFixMissingImport,
}: QuickFixBannerProps) {
  if (activeTypo && onFixTypo) {
    return (
      <div className={styles.quickfixBanner}>
        <div className={styles.bannerLeft}>
          <AlertCircle size={13} className={styles.iconError} />
          <span className={styles.message}>
            Стр {activeTypo.line}: Опечатка{" "}
            <code className={styles.errorWord}>{activeTypo.typo}</code> вместо{" "}
            <strong>{activeTypo.correct}</strong>
          </span>
        </div>
        <Tooltip content={`Заменить '${activeTypo.typo}' на '${activeTypo.correct}'`} side="bottom">
          <button
            type="button"
            className={styles.fixBtn}
            onClick={() => onFixTypo(activeTypo)}
            aria-label={`Заменить '${activeTypo.typo}' на '${activeTypo.correct}'`}
          >
            <Wand2 size={12} />
            <span>Исправить на {activeTypo.correct}</span>
          </button>
        </Tooltip>
      </div>
    );
  }

  if (activeMissingImport && onFixMissingImport) {
    return (
      <div className={styles.quickfixBanner}>
        <div className={styles.bannerLeft}>
          <Lightbulb size={13} className={styles.iconBulb} />
          <span className={styles.message}>
            Стр {activeMissingImport.line}: <code>{activeMissingImport.symbol}</code> не
            импортирован из{" "}
            <strong className={styles.importModName}>'{activeMissingImport.module}'</strong>
          </span>
        </div>
        <Tooltip
          content={`Добавить import ${
            activeMissingImport.isDefault
              ? activeMissingImport.symbol
              : `{ ${activeMissingImport.symbol} }`
          } from '${activeMissingImport.module}'`}
          side="bottom"
        >
          <button
            type="button"
            className={styles.fixBtn}
            onClick={() => onFixMissingImport(activeMissingImport)}
            aria-label="Добавить импорт"
          >
            <Wand2 size={12} />
            <span>Добавить импорт ({activeMissingImport.module})</span>
          </button>
        </Tooltip>
      </div>
    );
  }

  return null;
}
