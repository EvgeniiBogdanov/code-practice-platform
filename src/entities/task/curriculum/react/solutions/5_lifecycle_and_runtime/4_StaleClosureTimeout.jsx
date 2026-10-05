import { useEffect, useRef, useState } from "react";

// Ответ: alert покажет «Счётчик: 0».
// Каждый рендер — это отдельный вызов функции со своими константами.
// showLater из рендера с count = 0 создал колбэк, который навсегда замкнул count = 0.
// Последующие рендеры создают новые замыкания, но таймер уже держит старое.

export default function DelayedAlert() {
  const [count, setCount] = useState(0);

  // Ref — одна и та же «коробка» на все рендеры: таймер читает актуальное значение
  const countRef = useRef(count);
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  const showLater = () => {
    setTimeout(() => {
      alert(`Счётчик: ${countRef.current}`);
    }, 3000);
  };

  return (
    <div>
      <p>Счётчик: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
      <button onClick={showLater}>Показать через 3 секунды</button>
    </div>
  );
}

// Важно: «устаревшее» значение — не баг React, а свойство замыканий.
// Иногда это и есть нужное поведение: например, отправить сообщение тому собеседнику,
// который был выбран в момент клика, а не через 3 секунды.
