import {
  useLayoutEffect,
  useRef,
  useState,
  type JSX,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { clsx } from "clsx";
import type { Editor } from "@tiptap/core";
import {
  ChevronRight,
  Copy,
  CopyPlus,
  Palette,
  Repeat2,
  Scissors,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { useOnClickOutside } from "@/shared/lib/hooks";
import {
  colorBlock,
  convertBlock,
  copyBlock,
  cutBlock,
  deleteBlock,
  duplicateBlock,
  getBlockColors,
  type BlockTarget,
} from "../../lib/blockActions";
import { CONVERT_ITEMS } from "../../lib/blockItems";
import { BlockMenu, type BlockMenuHandle } from "../BlockMenu/BlockMenu";
import { ColorMenu } from "../ColorMenu/ColorMenu";
import styles from "./BlockActionsMenu.module.css";

type Submenu = "convert" | "color";

interface MenuAction {
  id: string;
  label: string;
  icon: LucideIcon;
  submenu?: Submenu;
  isDanger?: boolean;
  run?: (editor: Editor, target: BlockTarget) => void | Promise<void>;
}

const ACTIONS: readonly MenuAction[] = [
  { id: "copy", label: "Копировать", icon: Copy, run: copyBlock },
  { id: "cut", label: "Вырезать", icon: Scissors, run: cutBlock },
  { id: "duplicate", label: "Дублировать", icon: CopyPlus, run: duplicateBlock },
  { id: "convert", label: "Преобразовать в", icon: Repeat2, submenu: "convert" },
  { id: "color", label: "Цвет", icon: Palette, submenu: "color" },
  { id: "delete", label: "Удалить", icon: Trash2, isDanger: true, run: deleteBlock },
];

/** Blocks without text have nothing to recolour or reshape. */
const isActionAvailable = ({ id }: MenuAction, { node }: BlockTarget): boolean => {
  if (id === "convert") return node.type.name !== "table" && node.type.name !== "horizontalRule";
  if (id === "color") return node.type.name !== "horizontalRule" && node.type.name !== "codeBlock";
  return true;
};

const VIEWPORT_MARGIN = 8;
const MENU_GAP = 4;

interface BlockActionsMenuProps {
  editor: Editor;
  target: BlockTarget;
  /** The handle the menu hangs from. */
  anchor: DOMRect;
  onClose: () => void;
}

/** Notion's block menu: copy, cut, duplicate, turn into, colour and delete. */
export const BlockActionsMenu = ({
  editor,
  target,
  anchor,
  onClose,
}: BlockActionsMenuProps): JSX.Element => {
  const rootRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<BlockMenuHandle>(null);
  const [selected, setSelected] = useState(0);
  const [openSubmenu, setOpenSubmenu] = useState<Submenu | null>(null);
  const [isSubmenuFlipped, setIsSubmenuFlipped] = useState(false);
  // The menu is dim until it is used: with the pointer over it, or with the keys.
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);

  const actions = ACTIONS.filter((action) => isActionAvailable(action, target));

  useOnClickOutside(rootRef, onClose);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { width, height } = root.getBoundingClientRect();
    const left = Math.min(anchor.left, window.innerWidth - width - VIEWPORT_MARGIN);
    const top = Math.min(anchor.bottom + MENU_GAP, window.innerHeight - height - VIEWPORT_MARGIN);
    root.style.setProperty("--menu-left", `${Math.max(left, VIEWPORT_MARGIN)}px`);
    root.style.setProperty("--menu-top", `${Math.max(top, VIEWPORT_MARGIN)}px`);
    root.focus();
  }, [anchor]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const submenu = root?.querySelector<HTMLElement>("[data-submenu]");
    if (!root || !submenu) return;
    const { right } = root.getBoundingClientRect();
    const { width, bottom } = submenu.getBoundingClientRect();
    setIsSubmenuFlipped(right + width + MENU_GAP > window.innerWidth);
    // Slide a tall submenu up so its end stays on screen.
    const overflow = bottom - (window.innerHeight - VIEWPORT_MARGIN);
    submenu.style.setProperty("--submenu-shift", `${Math.max(overflow, 0)}px`);
  }, [openSubmenu]);

  const finish = (): void => {
    onClose();
    editor.commands.focus();
  };

  const runAction = (action: MenuAction): void => {
    if (action.submenu) {
      setOpenSubmenu(action.submenu);
      return;
    }
    void action.run?.(editor, target);
    finish();
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>): void => {
    const { key } = event;
    setIsKeyboardActive(true);
    if (openSubmenu) {
      if (submenuRef.current?.onKeyDown(event.nativeEvent)) event.preventDefault();
      else if (key === "ArrowLeft" || key === "Escape") setOpenSubmenu(null);
      else return;
      event.preventDefault();
      return;
    }
    if (key === "Escape") finish();
    else if (key === "ArrowDown") setSelected((index) => (index + 1) % actions.length);
    else if (key === "ArrowUp")
      setSelected((index) => (index - 1 + actions.length) % actions.length);
    else if (key === "Enter" || key === "ArrowRight") runAction(actions[selected]);
    else return;
    event.preventDefault();
  };

  return createPortal(
    <div
      ref={rootRef}
      className={styles.menu}
      role="menu"
      aria-label="Действия с блоком"
      tabIndex={-1}
      data-keyboard={isKeyboardActive || undefined}
      onKeyDown={handleKeyDown}
      onMouseLeave={(): void => setIsKeyboardActive(false)}
    >
      {actions.map((action, index) => {
        const Icon = action.icon;
        const isSubmenuOpen = openSubmenu === action.submenu && action.submenu !== undefined;
        return (
          <div key={action.id} className={styles.row}>
            <button
              type="button"
              role="menuitem"
              aria-haspopup={action.submenu ? "menu" : undefined}
              aria-expanded={action.submenu ? isSubmenuOpen : undefined}
              className={clsx(
                styles.item,
                index === selected && styles.active,
                action.isDanger && styles.danger
              )}
              onMouseEnter={(): void => {
                setSelected(index);
                setOpenSubmenu(action.submenu ?? null);
              }}
              onClick={(): void => runAction(action)}
            >
              <Icon size={16} className={styles.icon} />
              <span className={styles.label}>{action.label}</span>
              {action.submenu && <ChevronRight size={14} className={styles.chevron} />}
            </button>
            {isSubmenuOpen && (
              <div
                data-submenu
                className={clsx(styles.submenu, isSubmenuFlipped && styles.flipped)}
              >
                {action.submenu === "convert" ? (
                  <BlockMenu
                    ref={submenuRef}
                    items={CONVERT_ITEMS}
                    heading="Преобразовать в"
                    onSelect={(item): void => {
                      convertBlock(editor, target, item);
                      finish();
                    }}
                  />
                ) : (
                  <ColorMenu
                    ref={submenuRef}
                    current={getBlockColors(target)}
                    onSelect={(colors): void => {
                      colorBlock(editor, target, colors);
                      finish();
                    }}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>,
    document.body
  );
};
