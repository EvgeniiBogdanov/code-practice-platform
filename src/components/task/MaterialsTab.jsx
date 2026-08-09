import React, { useMemo } from "react";
import { BookOpen, Clock, ExternalLink } from "lucide-react";
import { TASK_EXPLANATIONS } from "../../taskExplanations";
import { parseSolutionCodeAndExplanation } from "../../utils/solutionParser";
import { parseMarkdownBlocks } from "../../utils/markdownParser";
import TheoryCodeBlock from "./TheoryCodeBlock";

export const MaterialsTab = ({ selectedTask }) => {
  let explanationText =
    TASK_EXPLANATIONS[selectedTask.id] ||
    selectedTask.explanation ||
    null;

  if (!explanationText && selectedTask.rawSolution) {
    const parsed = parseSolutionCodeAndExplanation(
      selectedTask.rawSolution
    );
    explanationText = parsed.explanation;
  }

  if (explanationText) {
    explanationText = explanationText
      .replace(/^###\s*Разбор решения[:\s]*[^\n]*\n*/gi, "")
      .trim();
  }

  const blocks = useMemo(() => {
    if (!explanationText) return [];
    return parseMarkdownBlocks(explanationText);
  }, [explanationText]);

  // Оценка времени чтения статьи на основе количества слов
  const readingTimeMinutes = useMemo(() => {
    if (!explanationText) return 1;
    const words = explanationText.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 140));
  }, [explanationText]);

  const hasExplanation = Boolean(explanationText) && blocks.length > 0;
  const hasArticles =
    selectedTask.articles && selectedTask.articles.length > 0;

  if (!hasExplanation && !hasArticles) {
    return (
      <div
        className="materials-empty-state"
        style={{
          color: "var(--text-muted)",
          fontStyle: "italic",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        <div>Материалы и разбор для данной задачи формируются.</div>
      </div>
    );
  }

  return (
    <div className="materials-tab-container" style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
      {hasExplanation && (
        <article className="notion-article-page">
          {/* Notion Page Header */}
          <header className="notion-article-header">
            <div className="notion-article-header-top">
              <div className="notion-article-header-info" style={{ flex: 1 }}>
                <h1 className="notion-article-title">
                  Разбор решения: {selectedTask.title}
                </h1>
                <div className="notion-article-meta" style={{ marginTop: "8px" }}>
                  {selectedTask.difficulty && (
                    <span className={`notion-meta-badge difficulty-badge difficulty-${selectedTask.difficulty}`}>
                      {selectedTask.difficulty === "easy" ? "Легкая" : selectedTask.difficulty === "medium" ? "Средняя" : "Сложная"}
                    </span>
                  )}
                  <span className="notion-meta-badge notion-badge-blue">
                    <BookOpen size={12} /> Разбор решения
                  </span>
                  <span className="notion-meta-badge notion-badge-yellow">
                    <Clock size={12} /> ~{readingTimeMinutes} мин чтения
                  </span>
                  {hasArticles && (
                    <span className="notion-meta-badge notion-badge-purple">
                      <ExternalLink size={12} /> Ссылки на материалы и статьи
                    </span>
                  )}
                </div>
              </div>
            </div>
          </header>

          <hr className="notion-article-divider" />

          {/* Notion Article Body */}
          <div className="notion-article-content">
            {blocks.map((block, idx) => {
              if (block.type === "code") {
                return (
                  <TheoryCodeBlock
                    key={idx}
                    code={block.code}
                    language={block.language}
                  />
                );
              }
              return (
                <div
                  key={idx}
                  dangerouslySetInnerHTML={{
                    __html: block.html,
                  }}
                />
              );
            })}
          </div>
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
