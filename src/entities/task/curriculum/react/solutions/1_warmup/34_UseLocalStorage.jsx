import { useEffect, useState } from "react";

const readValue = (key, initialValue) => {
  try {
    const stored = localStorage.getItem(key);
    return stored === null ? initialValue : JSON.parse(stored);
  } catch {
    // Битый JSON или недоступное хранилище (приватный режим) — не роняем приложение
    return initialValue;
  }
};

export const useLocalStorage = (key, initialValue) => {
  // Ленивая инициализация: localStorage читается только при первом рендере
  const [value, setValue] = useState(() => readValue(key, initialValue));

  // Синхронизация с внешней системой — это работа для эффекта
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Хранилище переполнено или недоступно — значение остаётся в памяти
    }
  }, [key, value]);

  return [value, setValue];
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
