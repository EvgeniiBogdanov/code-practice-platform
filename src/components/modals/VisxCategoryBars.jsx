import React from "react";
import { LinearGradient } from "@visx/gradient";

export const VisxCategoryBars = ({ categories = [] }) => {
  if (!categories || categories.length === 0) {
    return (
      <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px 0" }}>
        Нет данных по категориям
      </div>
    );
  }

  return (
    <div className="visx-category-bars-container">
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <LinearGradient id="visx-cat-green" from="#10b981" to="#059669" />
          <LinearGradient id="visx-cat-blue" from="#38bdf8" to="#2563eb" />
          <LinearGradient id="visx-cat-amber" from="#f59e0b" to="#d97706" />
          <LinearGradient id="visx-cat-purple" from="#a855f7" to="#7c3aed" />
        </defs>
      </svg>

      <div className="visx-category-list">
        {categories.map((cat, i) => {
          const total = cat.total || 0;
          const completed = cat.completed || 0;
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
          const isDone = total > 0 && completed === total;

          let gradientId = "visx-cat-blue";
          let accentColor = "#38bdf8";
          if (isDone) {
            gradientId = "visx-cat-green";
            accentColor = "#10b981";
          } else if (pct >= 50) {
            gradientId = "visx-cat-amber";
            accentColor = "#f59e0b";
          }

          return (
            <div key={`cat-bar-${i}`} className="visx-cat-row">
              <div className="visx-cat-header-row">
                <div className="visx-cat-name-badge">
                  {cat.icon && <span className="visx-cat-icon">{cat.icon}</span>}
                  <span className="visx-cat-title" title={cat.name}>
                    {cat.name}
                  </span>
                </div>
                <div className="visx-cat-numbers">
                  <span className="visx-cat-count">
                    {cat.note ? cat.note : `${completed}/${total}`}
                  </span>
                  <span
                    className={`visx-cat-pct-badge ${isDone ? "done" : ""}`}
                    style={{
                      color: accentColor,
                      backgroundColor: `${accentColor}18`,
                    }}
                  >
                    {pct}%
                  </span>
                </div>
              </div>

              {/* Dual Layer Progress Bar */}
              <div className="visx-bar-svg-wrap">
                <svg width="100%" height="5" style={{ display: "block", overflow: "visible" }}>
                  <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="5"
                    rx="2.5"
                    fill="var(--border-color, rgba(255, 255, 255, 0.08))"
                  />
                  <rect
                    x="0"
                    y="0"
                    width={`${pct}%`}
                    height="5"
                    rx="2.5"
                    fill={`url(#${gradientId})`}
                    style={{
                      transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VisxCategoryBars;
