import { useState, useEffect } from "react";

// **Реализуйте подписку на глобальные события окна (EventListener)**

// **Требования:**
// 1. Добавьте слушатель события нажатия клавиш.
// 2. При нажатии клавиши "Escape" закрывайте модальное окно
// 3. Подписка должна быть активна, когда модальное окно открыто.

const EscapeModal = () => {
  const [isOpen, setIsOpen] = useState(false);



  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Открыть окно</button>

      {isOpen && (
        <div>
          <p>Модальное окно активно (нажмите Escape для закрытия)</p>
          <button onClick={() => setIsOpen(false)}>Закрыть</button>
        </div>
      )}
    </div>
  );
};

export default EscapeModal;
