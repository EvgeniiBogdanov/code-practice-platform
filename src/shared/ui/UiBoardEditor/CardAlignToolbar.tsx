import { type JSX } from "react";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { Button } from "../Button";
import type { CardAlign } from "./boardTypes";
import styles from "./BoardCanvas.module.css";

const ICON_SIZE = 16;

const OPTIONS: readonly { value: CardAlign; label: string; icon: JSX.Element }[] = [
  { value: "left", label: "Текст слева", icon: <AlignLeft size={ICON_SIZE} /> },
  { value: "center", label: "Текст по центру", icon: <AlignCenter size={ICON_SIZE} /> },
  { value: "right", label: "Текст справа", icon: <AlignRight size={ICON_SIZE} /> },
];

export interface CardAlignToolbarProps {
  value: CardAlign;
  onChange: (value: CardAlign) => void;
}

/** The three text positions of a card; the current one is pressed. */
export const CardAlignToolbar = ({ value, onChange }: CardAlignToolbarProps): JSX.Element => (
  <div className={styles.alignToolbar} role="group" aria-label="Положение текста">
    {OPTIONS.map((option) => (
      <Button
        key={option.value}
        size="icon-sm"
        variant="ghost"
        aria-label={option.label}
        title={option.label}
        aria-pressed={value === option.value}
        isActive={value === option.value}
        onClick={() => onChange(option.value)}
      >
        {option.icon}
      </Button>
    ))}
  </div>
);
