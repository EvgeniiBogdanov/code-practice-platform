import React, { useEffect } from "react";
import { Lightbulb, X, Sparkles, Check, Copy } from "lucide-react";
import { CHEAT_SHEET_DATA, SECTION_CHEAT_SHEETS } from "../../data/cheatSheetData";
import { highlightJS } from "../../utils/codeHighlighter";
import { useUIStore } from "../../stores/useUIStore";
import { useProgressStore } from "../../stores/useProgressStore";

export const CheatSheetModal = ({
  cheatSheetOpen: propCheatSheetOpen,
  setCheatSheetOpen: propSetCheatSheetOpen,
  cheatSearch: propCheatSearch,
  setCheatSearch: propSetCheatSearch,
  cheatCategory: propCheatCategory,
  setCheatCategory: propSetCheatCategory,
  handleCopyCode: propHandleCopyCode,
  copiedCodeId: propCopiedCodeId,
  activeSection = "react",
}) => {
  const storeCheatSheetOpen = useUIStore((state) => state.cheatSheetOpen);
  const storeSetCheatSheetOpen = useUIStore((state) => state.setCheatSheetOpen);
  const storeCheatSearch = useUIStore((state) => state.cheatSearch);
  const storeSetCheatSearch = useUIStore((state) => state.setCheatSearch);
  const storeCheatCategory = useUIStore((state) => state.cheatCategory);
  const storeSetCheatCategory = useUIStore((state) => state.setCheatCategory);

  const storeHandleCopyCode = useProgressStore((state) => state.handleCopyCode);
  const storeCopiedCodeId = useProgressStore((state) => state.copiedCodeId);

  const cheatSheetOpen = propCheatSheetOpen !== undefined ? propCheatSheetOpen : storeCheatSheetOpen;
  const setCheatSheetOpen = propSetCheatSheetOpen || storeSetCheatSheetOpen;
  const cheatSearch = propCheatSearch !== undefined ? propCheatSearch : storeCheatSearch;
  const setCheatSearch = propSetCheatSearch || storeSetCheatSearch;
  const cheatCategory = propCheatCategory !== undefined ? propCheatCategory : storeCheatCategory;
  const setCheatCategory = propSetCheatCategory || storeSetCheatCategory;
  const handleCopyCode = propHandleCopyCode || storeHandleCopyCode;
  const copiedCodeId = propCopiedCodeId !== undefined ? propCopiedCodeId : storeCopiedCodeId;
  const currentSectionConfig =
    SECTION_CHEAT_SHEETS[activeSection] || SECTION_CHEAT_SHEETS.react;

  // Автоматическая установка первой имеющейся категории при смене раздела или открытии
  useEffect(() => {
    if (cheatSheetOpen) {
      const validCategories = currentSectionConfig.categories.map((c) => c.id);
      if (!validCategories.includes(cheatCategory)) {
        setCheatCategory(currentSectionConfig.defaultCategory);
      }
    }
  }, [cheatSheetOpen, activeSection, currentSectionConfig, cheatCategory, setCheatCategory]);

  const deferredCheatSearch = React.useDeferredValue(cheatSearch);
  const currentCategoryData = CHEAT_SHEET_DATA[cheatCategory] || [];

  const filteredData = React.useMemo(() => {
    const q = deferredCheatSearch.trim().toLowerCase();
    if (!q) return currentCategoryData;
    return currentCategoryData.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q)
    );
  }, [currentCategoryData, deferredCheatSearch]);

  if (!cheatSheetOpen) return null;

  return (
    <div className="cheatsheet-drawer-overlay" onClick={() => setCheatSheetOpen(false)}>
      <div className="cheatsheet-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cheatsheet-header">
          <div className="cheatsheet-title">
            <Lightbulb size={18} /> {currentSectionConfig.title}
          </div>
          <button className="cheatsheet-close-btn" onClick={() => setCheatSheetOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <input
          type="text"
          className="cheatsheet-search"
          placeholder="Поиск по методам, типам, патернам..."
          value={cheatSearch}
          onChange={(e) => setCheatSearch(e.target.value)}
        />

        <div className="cheatsheet-category-tabs">
          {currentSectionConfig.categories.map((cat) => (
            <button
              key={cat.id}
              className={cheatCategory === cat.id ? "active" : ""}
              onClick={() => setCheatCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="cheatsheet-content">
          {filteredData.length === 0 ? (
            <div style={{ color: "var(--text-muted)", fontStyle: "italic", padding: "20px", textAlign: "center" }}>
              По вашему запросу ничего не найдено
            </div>
          ) : (
            filteredData.map((item, idx) => (
              <div key={idx} className="cheatsheet-card">
                <div className="cheatsheet-card-header">
                  <h4>{item.title}</h4>
                </div>
                <div className="cheatsheet-code-block">
                  <pre className="code-preview-block" style={{ fontSize: "12.5px", padding: "12px", margin: "8px 0" }}>
                    <code
                      dangerouslySetInnerHTML={{
                        __html: highlightJS(item.code),
                      }}
                    />
                  </pre>
                  <button
                    className={`code-copy-btn ${copiedCodeId === `cheat-${cheatCategory}-${idx}` ? "copied" : ""}`}
                    onClick={() => handleCopyCode(`cheat-${cheatCategory}-${idx}`, item.code)}
                    title={copiedCodeId === `cheat-${cheatCategory}-${idx}` ? "Скопировано!" : "Копировать код"}
                  >
                    {copiedCodeId === `cheat-${cheatCategory}-${idx}` ? (
                      <Check size={13} />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>
                {item.tip && (
                  <div className="cheatsheet-tip">
                    <div className="cheatsheet-tip-header">
                      <Sparkles size={14} />
                      <span>Лайфхак для интервью</span>
                    </div>
                    <div className="cheatsheet-tip-content">{item.tip}</div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CheatSheetModal;
