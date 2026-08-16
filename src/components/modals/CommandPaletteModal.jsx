import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, Code2, Zap, Brain, FileText } from "lucide-react";
import { getGroupMeta } from "../../javascript/data/groupConfig";
import { getAlgoGroupMeta } from "../../algorithms/data/groupConfig";
import { getDifficultyLabel } from "../../utils/difficultyHelpers";
import { useUIStore } from "../../stores/useUIStore";
import { FILE_ICON_COLOR } from "../../constants/uiConstants";

const SECTION_LABELS = {
  react: { label: "REACT", icon: <Code2 size={12} style={{ color: "#61dafb" }} /> },
  javascript: { label: "JS", icon: <Zap size={12} style={{ color: "#f59e0b" }} /> },
  algorithms: { label: "ALGO", icon: <Brain size={12} style={{ color: "#a855f7" }} /> },
};

export const CommandPaletteModal = ({
  paletteOpen: propPaletteOpen,
  setPaletteOpen: propSetPaletteOpen,
  paletteQuery: propPaletteQuery,
  setPaletteQuery: propSetPaletteQuery,
  allTasksList = [],
  selectedTask,
  activeSection = "react",
}) => {
  const navigate = useNavigate();

  const storePaletteOpen = useUIStore((state) => state.paletteOpen);
  const storeSetPaletteOpen = useUIStore((state) => state.setPaletteOpen);
  const storePaletteQuery = useUIStore((state) => state.paletteQuery);
  const storeSetPaletteQuery = useUIStore((state) => state.setPaletteQuery);

  const paletteOpen = propPaletteOpen !== undefined ? propPaletteOpen : storePaletteOpen;
  const setPaletteOpen = propSetPaletteOpen || storeSetPaletteOpen;
  const paletteQuery = propPaletteQuery !== undefined ? propPaletteQuery : storePaletteQuery;
  const setPaletteQuery = propSetPaletteQuery || storeSetPaletteQuery;

  const deferredQuery = React.useDeferredValue(paletteQuery);

  // Filter tasks by current active section (home shows all)
  const sectionTasks = React.useMemo(() => {
    return activeSection === "home"
      ? allTasksList
      : allTasksList.filter((t) => t.section === activeSection);
  }, [activeSection, allTasksList]);

  const filteredTasks = React.useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (!q) return sectionTasks;
    return sectionTasks.filter((t) => {
      return (
        t.title?.toLowerCase().includes(q) ||
        (t.category && t.category.toLowerCase().includes(q)) ||
        (t.group && t.group.toLowerCase().includes(q)) ||
        (t.subgroup && t.subgroup.toLowerCase().includes(q)) ||
        (t.difficulty && t.difficulty.toLowerCase().includes(q))
      );
    });
  }, [sectionTasks, deferredQuery]);

  if (!paletteOpen) return null;

  const sectionLabel = activeSection === "home"
    ? "Все разделы"
    : activeSection === "react"
      ? "React"
      : activeSection === "javascript"
        ? "JavaScript"
        : "Алгоритмы";

  const handleSelectTask = (task) => {
    setPaletteOpen(false);
    if (task.section === "javascript") {
      navigate({
        to: "/javascript/$taskId",
        params: { taskId: String(task.id) },
        search: (prev) => prev,
      });
    } else if (task.section === "algorithms") {
      navigate({
        to: "/algorithms/$taskId",
        params: { taskId: String(task.id) },
        search: (prev) => prev,
      });
    } else {
      navigate({
        to: "/react/$taskId",
        params: { taskId: String(task.id) },
        search: (prev) => prev,
      });
    }
  };

  return (
    <div
      className="command-palette-overlay"
      onClick={() => setPaletteOpen(false)}
    >
      <div
        className="command-palette"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="command-palette-header">
          <Search size={16} />
          <input
            autoFocus
            placeholder={`Поиск задачи в разделе ${sectionLabel}...`}
            value={paletteQuery}
            onChange={(e) => setPaletteQuery(e.target.value)}
            className="command-palette-input"
          />
          <kbd className="header-kbd">ESC</kbd>
        </div>
        <div className="command-palette-results">
          {filteredTasks.map((task) => {
            const sectionMeta = SECTION_LABELS[task.section] || SECTION_LABELS.react;
            const jsMeta = task.section === "javascript" && task.group ? getGroupMeta(task.group) : null;
            const algoMeta = task.section === "algorithms" && task.group ? getAlgoGroupMeta(task.group) : null;

            return (
              <button
                key={`${task.section}-${task.id}`}
                className={`command-palette-item ${
                  String(selectedTask?.id) === String(task.id) ? "active" : ""
                }`}
                onClick={() => handleSelectTask(task)}
              >
                {activeSection === "home" && (
                  <span className="palette-item-section-badge" style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "10px", fontWeight: 600, padding: "1px 6px", borderRadius: "4px", background: "var(--state-hover)", color: "var(--text-muted)", marginRight: "4px", flexShrink: 0 }}>
                    {sectionMeta.icon} {sectionMeta.label}
                  </span>
                )}
                <FileText size={15} className="node-file-icon" style={{ color: FILE_ICON_COLOR, flexShrink: 0 }} />
                <span className="palette-item-title">{task.title}</span>

                {task.difficulty && (
                  <span
                    className={`difficulty-badge difficulty-${task.difficulty}`}
                  >
                    {getDifficultyLabel(task.difficulty)}
                  </span>
                )}

                {jsMeta && (
                  <span
                    className="js-group-badge"
                    style={{
                      background: jsMeta.bg,
                      color: jsMeta.color,
                    }}
                  >
                    {task.group}
                  </span>
                )}

                {algoMeta && (
                  <span
                    className="js-group-badge"
                    style={{
                      background: "rgba(168, 85, 247, 0.15)",
                      color: "#c084fc",
                      border: "1px solid rgba(168, 85, 247, 0.3)",
                    }}
                  >
                    {task.group}
                  </span>
                )}
              </button>
            );
          })}
          {filteredTasks.length === 0 && (
            <div className="command-palette-empty">
              Ничего не найдено по запросу «{paletteQuery}» в разделе {sectionLabel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPaletteModal;
