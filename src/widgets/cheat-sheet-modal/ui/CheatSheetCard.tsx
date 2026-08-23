import { memo } from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import { CodeViewer } from "@/shared/ui";
import styles from "./CheatSheetModal.module.css";

export interface CheatItem {
  title: string;
  desc?: string;
  code: string;
  tip?: string;
}

interface CheatSheetCardProps {
  item: CheatItem;
  cardId: string;
  isCopied: boolean;
  onCopy: (code: string, cardId: string) => void;
}

export const CheatSheetCard = memo(({ item, cardId, isCopied, onCopy }: CheatSheetCardProps) => {
  return (
    <div className={styles.cheatCard}>
      <div className={styles.cardHeader}>
        <h4 className={styles.cardTitle}>{item.title}</h4>
      </div>

      {item.desc && <p className={styles.cardDesc}>{item.desc}</p>}

      <div className={styles.codeBlockWrapper}>
        <button
          type="button"
          className={[styles.codeCopyBtn, isCopied && styles.copied].filter(Boolean).join(" ")}
          onClick={() => onCopy(item.code, cardId)}
          title={isCopied ? "Скопировано!" : "Копировать код"}
        >
          {isCopied ? <Check size={12} /> : <Copy size={12} />}
          <span>{isCopied ? "Скопировано!" : "Копировать"}</span>
        </button>
        <CodeViewer code={item.code} language="javascript" />
      </div>

      {item.tip && (
        <div className={styles.cheatsheetTip}>
          <div className={styles.cheatsheetTipHeader}>
            <Sparkles size={13} />
            <span>Лайфхак для интервью</span>
          </div>
          <div className={styles.cheatsheetTipContent}>{item.tip}</div>
        </div>
      )}
    </div>
  );
});

CheatSheetCard.displayName = "CheatSheetCard";
