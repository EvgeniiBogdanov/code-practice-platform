import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export const QuestionsTab = ({ selectedTask }) => {
  const [openItems, setOpenItems] = useState({});

  useEffect(() => {
    setOpenItems({});
  }, [selectedTask?.id]);

  const toggleItem = (idx) => {
    setOpenItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const questions = selectedTask?.interviewerQuestions || [];

  return (
    <div className="interviewer-questions-card">
      {questions.length > 0 ? (
        questions.map((q, idx) => {
          const isOpen = Boolean(openItems[idx]);
          return (
            <div key={idx} className="solution-recommendation-card">
              <button
                type="button"
                className="solution-recommendation-toggle"
                onClick={() => toggleItem(idx)}
                title={isOpen ? "Свернуть ответ" : "Развернуть ответ"}
              >
                <div className="solution-recommendation-header" style={{ fontSize: "14px" }}>
                  <span style={{ color: "#a855f7" }}>❓</span>
                  <span>
                    <strong>Вопрос {idx + 1}:</strong> {q.question}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`recommendation-chevron ${
                    isOpen ? "rotate-open" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="solution-recommendation-text" style={{ fontSize: "13.5px", lineHeight: "1.6" }}>
                  {q.answer}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div
          style={{
            color: "var(--text-muted)",
            fontStyle: "italic",
            padding: "20px 0",
          }}
        >
          Для данной задачи чек-лист вопросов формируется.
        </div>
      )}
    </div>
  );
};

export default QuestionsTab;
