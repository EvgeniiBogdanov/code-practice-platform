import { memo } from "react";
import { Sparkles } from "lucide-react";
import { CodeViewer, Callout } from "@/shared/ui";
import styles from "./CheatSheetModal.module.css";

export interface CheatItem {
  title: string;
  desc?: string;
  code: string;
  tip?: string;
}

interface CheatSheetCardProps {
  item: CheatItem;
  cardId?: string;
  isCopied?: boolean;
  onCopy?: (code: string, cardId: string) => void;
}

export const CheatSheetCard = memo(({ item }: CheatSheetCardProps) => {
  return (
    <div className={styles.cheatCard}>
      <div className={styles.cardHeader}>
        <h4 className={styles.cardTitle}>{item.title}</h4>
      </div>

      {item.desc && <p className={styles.cardDesc}>{item.desc}</p>}

      <div className={styles.codeBlockWrapper}>
        <CodeViewer code={item.code} language="javascript" showLineNumbers={false} />
      </div>

      {item.tip && (
        <Callout
          color="yellow"
          icon={<Sparkles size={13} />}
          title="Лайфхак для интервью"
          className={styles.cheatsheetCallout}
        >
          {item.tip}
        </Callout>
      )}
    </div>
  );
});

CheatSheetCard.displayName = "CheatSheetCard";
