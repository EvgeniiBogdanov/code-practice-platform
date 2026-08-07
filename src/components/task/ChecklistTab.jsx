import React from "react";

export const ChecklistTab = ({
  selectedTask,
  checklistState,
  toggleChecklistItem,
}) => {
  return (
    <div className="checklist-container">
      <div className="checklist-header">
        <div>
          <h3 className="checklist-title">📋 Самопроверка</h3>
          <p className="checklist-subtitle">
            Убедитесь, что ваше решение соответствует ключевым требованиям задачи и современным практикам React.
          </p>
        </div>
        <div className="checklist-score-badge">
          {(() => {
            const items = (selectedTask.checklist || []).map(
              (_, i) => `check-${selectedTask.id}-${i}`
            );
            const done = items.filter((k) => checklistState[k]).length;
            const total = items.length || 1;
            return `${Math.round((done / total) * 100)}% Готов к ответу`;
          })()}
        </div>
      </div>

      {selectedTask.checklist && selectedTask.checklist.length > 0 ? (
        <div className="checklist-section">
          {selectedTask.checklist.map((item, i) => (
            <label className="checkbox-row" key={`check-${selectedTask.id}-${i}`}>
              <input
                type="checkbox"
                checked={Boolean(checklistState[`check-${selectedTask.id}-${i}`])}
                onChange={() => toggleChecklistItem(`check-${selectedTask.id}-${i}`)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      ) : (
        <div className="checklist-section">
          <p style={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
            Для данной задачи чек-лист формируется.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChecklistTab;
