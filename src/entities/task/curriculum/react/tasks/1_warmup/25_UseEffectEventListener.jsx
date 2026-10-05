import { useState, useEffect } from "react";

// **Реализуйте подписку на глобальные события окна (EventListener)**

// **Требования:**
// 1. В useEffect добавьте слушатель события нажатия клавиш на window: window.addEventListener("keydown", handleKeyDown).
// 2. При нажатии клавиши "Escape" (e.key === "Escape") закрывайте модальное окно (устанавливайте isOpen в false).
// 3. В функции очистки эффекта обязательно удаляйте обработчик: window.removeEventListener("keydown", handleKeyDown).
// 4. Подписка должна быть активна, когда модальное окно открыто.

const EscapeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Реализуйте подписку на keydown и снятие слушателя

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
