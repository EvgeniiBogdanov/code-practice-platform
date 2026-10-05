import { useState, useEffect } from "react";

const EscapeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Обязательная очистка при закрытии модалки или размонтировании
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

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
