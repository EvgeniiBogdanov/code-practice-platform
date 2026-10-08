import { useImperativeHandle, useState, type JSX, type Ref } from "react";
import { clsx } from "clsx";
import { Check } from "lucide-react";
import type { BlockColors } from "../../lib/blockActions";
import { NOTE_COLOR_NAMES, type NoteColorName } from "../../lib/noteColor";
import type { BlockMenuHandle } from "../BlockMenu/BlockMenu";
import { notePaletteClass } from "../noteColors";
import styles from "./ColorMenu.module.css";

const COLOR_LABELS: Record<NoteColorName, string> = {
  gray: "Серый",
  orange: "Оранжевый",
  yellow: "Жёлтый",
  green: "Зелёный",
  blue: "Синий",
  purple: "Фиолетовый",
  pink: "Розовый",
  red: "Красный",
};

export type ColorKind = "color" | "background";

interface ColorEntry {
  kind: ColorKind;
  name: NoteColorName | null;
}

const SECTIONS: readonly { kind: ColorKind; title: string; defaultLabel: string }[] = [
  { kind: "color", title: "Цвет текста", defaultLabel: "Обычный текст" },
  { kind: "background", title: "Цвет фона", defaultLabel: "Без фона" },
];

const NAMES: readonly (NoteColorName | null)[] = [null, ...NOTE_COLOR_NAMES];

const ENTRIES: readonly ColorEntry[] = SECTIONS.flatMap(({ kind }) =>
  NAMES.map((name): ColorEntry => ({ kind, name }))
);

interface ColorSwatchProps {
  kind: ColorKind;
  name: NoteColorName | null;
}

/** The "A" chip of a colour: coloured letter for text colours, tinted square for backgrounds. */
export const ColorSwatch = ({ kind, name }: ColorSwatchProps): JSX.Element => (
  <span
    aria-hidden="true"
    className={clsx(styles.swatch, kind === "background" && styles.fill)}
    data-color={kind === "color" ? (name ?? undefined) : undefined}
    data-background={kind === "background" ? (name ?? undefined) : undefined}
  >
    A
  </span>
);

/** A colour picked earlier, offered again at the top of the menu. */
export interface ColorChoice {
  kind: ColorKind;
  name: NoteColorName;
}

interface ColorMenuProps {
  current: BlockColors;
  onSelect: (colors: Partial<BlockColors>) => void;
  lastUsed?: ColorChoice | null;
  ref?: Ref<BlockMenuHandle>;
}

/** Text and background colours for a block, like Notion's "Color" submenu. */
export const ColorMenu = ({
  current,
  onSelect,
  lastUsed = null,
  ref,
}: ColorMenuProps): JSX.Element => {
  const [selected, setSelected] = useState(0);

  const select = ({ kind, name }: ColorEntry): void => onSelect({ [kind]: name });

  useImperativeHandle(ref, () => ({
    onKeyDown: (event): boolean => {
      if (event.key === "ArrowDown") setSelected((index) => (index + 1) % ENTRIES.length);
      else if (event.key === "ArrowUp")
        setSelected((index) => (index - 1 + ENTRIES.length) % ENTRIES.length);
      else if (event.key === "Enter") select(ENTRIES[selected]);
      else return false;
      return true;
    },
  }));

  return (
    <div className={clsx(styles.menu, notePaletteClass)} role="listbox" aria-label="Цвет">
      {lastUsed && (
        <div className={styles.section}>
          <p className={styles.heading}>Последний использованный</p>
          <button
            type="button"
            role="option"
            aria-selected={current[lastUsed.kind] === lastUsed.name}
            className={styles.item}
            onMouseDown={(event): void => event.preventDefault()}
            onClick={(): void => select(lastUsed)}
          >
            <ColorSwatch kind={lastUsed.kind} name={lastUsed.name} />
            <span className={styles.label}>
              {COLOR_LABELS[lastUsed.name]} {lastUsed.kind === "color" ? "текст" : "фон"}
            </span>
          </button>
        </div>
      )}
      {SECTIONS.map(({ kind, title, defaultLabel }) => (
        <div key={kind} className={styles.section}>
          <p className={styles.heading}>{title}</p>
          {NAMES.map((name) => {
            const index = ENTRIES.findIndex((entry) => entry.kind === kind && entry.name === name);
            const label = name ? COLOR_LABELS[name] : defaultLabel;
            return (
              <button
                key={name ?? "default"}
                type="button"
                role="option"
                aria-selected={current[kind] === name}
                className={clsx(styles.item, index === selected && styles.active)}
                onMouseDown={(event): void => event.preventDefault()}
                onMouseEnter={(): void => setSelected(index)}
                onClick={(): void => select(ENTRIES[index])}
              >
                <ColorSwatch kind={kind} name={name} />
                <span className={styles.label}>{label}</span>
                {current[kind] === name && <Check size={14} className={styles.check} />}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};
