import { useState, useCallback } from "react";

// Кастомный хук инкапсулирует логику переключения булевого значения
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(Boolean(initialValue));

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle, setValue];
};

const ToggleDemo = () => {
  const [isVisible, toggleVisible, setIsVisible] = useToggle(false);

  return (
    <div>
      <h3>Демонстрация useToggle</h3>
      <div>
        <button onClick={toggleVisible}>Переключить</button>
        <button onClick={() => setIsVisible(true)}>Показать</button>
        <button onClick={() => setIsVisible(false)}>Скрыть</button>
      </div>
      {isVisible && (
        <div>
          <p>Секретный контент: хук useToggle успешно работает!</p>
        </div>
      )}
    </div>
  );
};

export default ToggleDemo;
