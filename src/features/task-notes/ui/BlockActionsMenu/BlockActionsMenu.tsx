import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type JSX,
  type RefObject,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { clsx } from "clsx";
import { AnimatePresence, useIsPresent } from "motion/react";
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
import { UiPopoverSurface } from "@/shared/ui";
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
/** A row the pointer rests on while crossing towards the open submenu opens after this delay (ms). */
const SETTLE_DELAY = 150;

interface Point {
  x: number;
  y: number;
}

const cross = (a: Point, b: Point, p: Point): number =>
  (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);

const isInTriangle = (p: Point, a: Point, b: Point, c: Point): boolean => {
  const signs = [cross(a, b, p), cross(b, c, p), cross(c, a, p)];
  return signs.every((sign) => sign >= 0) || signs.every((sign) => sign <= 0);
};

/** The open submenu, not one still fading out next to it. */
const findSubmenu = (root: HTMLElement | null, submenu: Submenu | null): HTMLElement | null =>
  submenu ? (root?.querySelector<HTMLElement>(`[data-submenu="${submenu}"]`) ?? null) : null;

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
  // One per submenu: a submenu fading out unmounts later and would clear a shared ref.
  const submenuRefs = {
    convert: useRef<BlockMenuHandle>(null),
    color: useRef<BlockMenuHandle>(null),
  } satisfies Record<Submenu, RefObject<BlockMenuHandle | null>>;
  const [selected, setSelected] = useState(0);
  const [openSubmenu, setOpenSubmenu] = useState<Submenu | null>(null);
  // The menu is dim until it is used: with the pointer over it, or with the keys.
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  // False while the menu fades out: it is closed already and must not close the next one.
  const isPresent = useIsPresent();

  // Where the pointer left the row that owns the open submenu.
  const exitPointRef = useRef<Point | null>(null);
  // Set while the pointer crosses a row towards the open submenu; cleared when it moves on.
  const settleTimerRef = useRef<number | null>(null);

  const actions = ACTIONS.filter((action) => isActionAvailable(action, target));

  useEffect(() => (): void => window.clearTimeout(settleTimerRef.current ?? undefined), []);

  const cancelSettle = (): void => {
    window.clearTimeout(settleTimerRef.current ?? undefined);
    settleTimerRef.current = null;
  };

  /** The menu stays mounted while it fades out, so nothing may still be pending in it. */
  const close = (): void => {
    cancelSettle();
    onClose();
  };

  useOnClickOutside(rootRef, (): void => {
    if (isPresent) close();
  });

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
    const submenu = findSubmenu(root, openSubmenu);
    const row = submenu?.parentElement;
    if (!root || !submenu || !row) return;
    // Layout sizes, not rects: the submenu may still be drifting in.
    const { offsetWidth: width, offsetHeight: height } = submenu;
    // Kept on the submenu itself, so one fading out next to it stays on its own side.
    const { right } = root.getBoundingClientRect();
    submenu.toggleAttribute("data-flipped", right + width + MENU_GAP > window.innerWidth);
    // Like Notion: centred on its row, so its far entries are as close as they can be. It ends
    // above the bottom of the screen and starts no higher than the note, unless it needs the room.
    const rowRect = row.getBoundingClientRect();
    const noteTop = editor.view.dom.getBoundingClientRect().top;
    const maxTop = window.innerHeight - VIEWPORT_MARGIN - height;
    const minTop = Math.max(Math.min(noteTop, maxTop), VIEWPORT_MARGIN);
    const centred = rowRect.top + rowRect.height / 2 - height / 2;
    const top = Math.max(Math.min(centred, maxTop), minTop);
    submenu.style.setProperty("--submenu-top", `${top - rowRect.top}px`);
  }, [editor, openSubmenu]);

  /** True while the pointer travels from its row towards the open submenu, like Notion. */
  const isHeadingToSubmenu = ({ clientX, clientY }: ReactMouseEvent): boolean => {
    const origin = exitPointRef.current;
    const submenu = findSubmenu(rootRef.current, openSubmenu);
    if (!origin || !submenu) return false;
    const { left, right, top, bottom } = submenu.getBoundingClientRect();
    const x = submenu.hasAttribute("data-flipped") ? right : left;
    return isInTriangle({ x: clientX, y: clientY }, origin, { x, y: top }, { x, y: bottom });
  };

  const finish = (): void => {
    close();
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
      if (submenuRefs[openSubmenu].current?.onKeyDown(event.nativeEvent)) event.preventDefault();
      else if (key === "ArrowLeft" || key === "Escape") setOpenSubmenu(null);
      else return;
      event.preventDefault();
      return;
    }
    if (key === "Escape") finish();
    else if (key === "ArrowDown") setSelected((index) => (index + 1) % actions.length);
    else if (key === "ArrowUp")
      setSelected((index) => (index - 1 + actions.length) % actions.length);
    // ArrowRight only opens a submenu: on a plain action it would run it, e.g. delete the block.
    else if (key === "Enter" || (key === "ArrowRight" && actions[selected].submenu))
      runAction(actions[selected]);
    else return;
    event.preventDefault();
  };

  return createPortal(
    <UiPopoverSurface
      ref={rootRef}
      isStill
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
              onMouseEnter={(event): void => {
                cancelSettle();
                if (openSubmenu && !isSubmenuOpen && isHeadingToSubmenu(event)) {
                  // Still on the way to the submenu; if the pointer stops here, this row takes over.
                  settleTimerRef.current = window.setTimeout((): void => {
                    settleTimerRef.current = null;
                    setSelected(index);
                    setOpenSubmenu(action.submenu ?? null);
                  }, SETTLE_DELAY);
                  return;
                }
                setSelected(index);
                setOpenSubmenu(action.submenu ?? null);
              }}
              onMouseLeave={(event): void => {
                cancelSettle();
                exitPointRef.current = { x: event.clientX, y: event.clientY };
              }}
              onClick={(): void => runAction(action)}
            >
              <Icon size={16} className={styles.icon} />
              <span className={styles.label}>{action.label}</span>
              {action.submenu && <ChevronRight size={14} className={styles.chevron} />}
            </button>
            <AnimatePresence>
              {isSubmenuOpen && (
                <div key={action.submenu} data-submenu={action.submenu} className={styles.submenu}>
                  {action.submenu === "convert" ? (
                    <BlockMenu
                      ref={submenuRefs.convert}
                      items={CONVERT_ITEMS}
                      onSelect={(item): void => {
                        convertBlock(editor, target, item);
                        finish();
                      }}
                    />
                  ) : (
                    <ColorMenu
                      ref={submenuRefs.color}
                      current={getBlockColors(target)}
                      onSelect={(colors): void => {
                        colorBlock(editor, target, colors);
                        finish();
                      }}
                    />
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </UiPopoverSurface>,
    document.body
  );
};
