import { useState, useRef, useEffect } from "react";

// **Реализуйте хранение значений между рендерами с помощью useRef (Non-DOM ref)**

// **Требования:**
// 1. Используйте timerRef = useRef(null) для хранения ID интервала без вызова ререндеров при его записи.
// 2. Кнопка "Старт": запускает setInterval (1000 мс) и сохраняет id в timerRef.current. Не запускает дублирующий интервал, если таймер уже тикает.
// 3. Кнопка "Стоп": очищает интервал через clearInterval(timerRef.current) и обнуляет timerRef.current = null.
// 4. Кнопка "Сброс": останавливает интервал и сбрасывает счетчик time в 0.
// 5. В useEffect очищайте интервал при размонтировании.

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  // Объявите timerRef

  // Реализуйте функции handleStart, handleStop, handleReset

  return (
    <div>
      <p>Время: {time} с</p>
      <button>Старт</button>
      <button>Стоп</button>
      <button>Сброс</button>
    </div>
  );
};

export default Stopwatch;
