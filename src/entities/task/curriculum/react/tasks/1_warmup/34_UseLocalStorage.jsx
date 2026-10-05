import { useState } from "react";

// **Создайте хук useLocalStorage**

// **Требования:**
// 1. useLocalStorage(key, initialValue) возвращает [value, setValue], как useState.
// 2. Начальное значение читается из localStorage ОДИН раз — через ленивую инициализацию useState.
// 3. Значение хранится в JSON. Если в хранилище битый JSON или его нет — используется initialValue.
// 4. При изменении value новое значение записывается в localStorage.
// 5. Примените хук: имя пользователя сохраняется между перезагрузками страницы.

export const useLocalStorage = (key, initialValue) => {
  // Напишите ваш код хука здесь
  return useState(initialValue);
};

const NameForm = () => {
  const [name, setName] = useLocalStorage("username", "");

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" />
      <p>Привет, {name || "гость"}!</p>
    </div>
  );
};

export default NameForm;
