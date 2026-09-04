import { useState } from "react";

// **Создайте собственный хук useToggle и примените его в компоненте**

// **Требования:**
// 1. Создайте кастомный хук useToggle(initialValue = false), который возвращает [value, toggle, setValue].
//    - toggle: инвертирует текущее логическое значение (setValue(prev => !prev)).
//    - setValue: позволяет принудительно установить конкретное boolean-значение.
// 2. В компоненте ToggleDemo используйте useToggle для управления видимостью блока с информацией.
// 3. Добавьте кнопки: "Переключить", "Показать", "Скрыть".

// Реализуйте кастомный хук useToggle
export const useToggle = (initialValue = false) => {
  // Напишите ваш код хука здесь
};

const ToggleDemo = () => {
  // Используйте хук useToggle

  return (
    <div>
      <h3>Демонстрация useToggle</h3>
      <div>
        {/* Кнопки управления */}
      </div>
      {/* Условное отображение скрытого блока */}
    </div>
  );
};

export default ToggleDemo;
