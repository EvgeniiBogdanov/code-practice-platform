import React from "react";

export const QuestionsTab = ({ selectedTask }) => {
  return (
    <div className="interviewer-questions-card">
      {selectedTask.interviewerQuestions &&
      selectedTask.interviewerQuestions.length > 0 ? (
        selectedTask.interviewerQuestions.map((q, idx) => (
          <details key={idx} className="question-item-accordion">
            <summary className="question-accordion-summary">
              <span className="question-accordion-title">❓ Вопрос {idx + 1}:</span>{" "}
              {q.question}
            </summary>
            <div className="question-accordion-content">
              <strong
                style={{
                  color: "var(--notion-blue)",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                💡 Эталонный ответ кандидата:
              </strong>
              {q.answer}
            </div>
          </details>
        ))
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
