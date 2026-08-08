import React from "react";
import { TASK_EXPLANATIONS } from "../../taskExplanations";
import { parseSolutionCodeAndExplanation } from "../../utils/solutionParser";
import { parseMarkdown } from "../../utils/markdownParser";

export const MaterialsTab = ({ selectedTask }) => {
  let explanationText =
    TASK_EXPLANATIONS[selectedTask.id] ||
    selectedTask.explanation ||
    null;

  if (!explanationText && selectedTask.rawSolution) {
    const parsed = parseSolutionCodeAndExplanation(
      selectedTask.rawSolution,
    );
    explanationText = parsed.explanation;
  }

  if (explanationText) {
    explanationText = explanationText
      .replace(/^###\s*Разбор решения[:\s]*[^\n]*\n*/gi, "")
      .trim();
  }

  const hasExplanation = Boolean(explanationText);
  const hasArticles =
    selectedTask.articles && selectedTask.articles.length > 0;

  if (!hasExplanation && !hasArticles) {
    return (
      <div
        className="materials-empty-state"
        style={{
          color: "var(--text-muted)",
          fontStyle: "italic",
          padding: "30px 20px",
          textAlign: "center",
        }}
      >
        <div>Материалы и разбор для данной задачи формируются.</div>
      </div>
    );
  }

  return (
    <div className="materials-tab-container" style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      {hasExplanation && (
        <article className="notion-article-page">
          <header className="notion-article-header">
            <h1 className="notion-article-title">
              Разбор решения: {selectedTask.title}
            </h1>
          </header>

          <hr className="notion-article-divider" />

          {/* Notion Article Body */}
          <div
            className="notion-article-content"
            dangerouslySetInnerHTML={{
              __html: parseMarkdown(explanationText),
            }}
          />
        </article>
      )}

      {hasArticles && (
        <div
          className="solution-articles-card"
          style={{ marginTop: 0, marginBottom: 0 }}
        >
          <div className="solution-articles-header">
            <span>📚</span> Полезные материалы и статьи
          </div>
          <ul className="solution-articles-list">
            {selectedTask.articles.map((art, idx) => (
              <li key={idx}>
                <span className="article-topic">
                  {art.title}:
                </span>{" "}
                <a
                  href={art.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="article-link"
                >
                  {art.urlTitle || "Читать статью"} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MaterialsTab;
