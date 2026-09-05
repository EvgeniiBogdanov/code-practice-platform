import { memo } from "react";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";
import { Icon, SquareButton, Tooltip } from "@/shared/ui";
import { useCommandPalette } from "../model";
import { CommandPaletteTabs } from "./CommandPaletteTabs";
import { CommandPaletteItem } from "./CommandPaletteItem";
import { CommandPaletteSkeleton } from "./CommandPaletteSkeleton";
import styles from "./CommandPalette.module.css";

export const CommandPalette = memo((): React.JSX.Element | null => {
  const {
    isOpen,
    setIsOpen,
    query,
    setQuery,
    debouncedQuery,
    activeSection,
    setActiveSection,
    selectedIndex,
    setSelectedIndex,
    filteredTasks,
    isLoading,
    handleSelectTask,
    handleKeyDown,
  } = useCommandPalette();

  if (!isOpen) return null;

  const paletteNode = (
    <div className={styles.paletteOverlay} onClick={() => setIsOpen(false)}>
      <div
        className={styles.paletteCard}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.paletteHeader}>
          <Icon size="sm" icon={<Search size={16} />} />
          <input
            autoFocus
            type="text"
            className={styles.paletteInput}
            placeholder="Поиск задачи..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            spellCheck={false}
          />
          <Tooltip content="Закрыть (Esc)" side="bottom">
            <SquareButton
              icon={<X size={18} />}
              onClick={() => setIsOpen(false)}
              aria-label="Закрыть поиск"
              size="sm"
            />
          </Tooltip>
        </div>

        <CommandPaletteTabs
          activeSection={activeSection}
          onSelectSection={(sec) => setActiveSection(sec)}
        />

        <div className={styles.paletteResults}>
          {isLoading && filteredTasks.length === 0 ? (
            <CommandPaletteSkeleton />
          ) : filteredTasks.length > 0 ? (
            filteredTasks.map((task, idx) => (
              <CommandPaletteItem
                key={`${task.section}-${task.id}`}
                task={task}
                isSelected={idx === selectedIndex}
                showSectionBadge={activeSection === "all"}
                onSelect={handleSelectTask}
                onMouseEnter={() => setSelectedIndex(idx)}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              Ничего не найдено по запросу «{debouncedQuery || query}»
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(paletteNode, document.body) : paletteNode;
});

CommandPalette.displayName = "CommandPalette";
