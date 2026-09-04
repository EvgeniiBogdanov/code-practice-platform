import { useState, useEffect } from "react";

// **Реализуйте секундомер с интервалом в useEffect**

// **Требования:**
// 1. При монтировании компонента запускается setInterval, который увеличивает seconds каждую секунду (1000 мс).
// 2. В функции очистки useEffect интервал обязательно очищается через clearInterval.
// 3. Используйте функциональную форму обновления состояния: setSeconds(prev => prev + 1),
//    чтобы избежать проблемы замыкания (stale closure) при пустом массиве зависимостей [].
// 4. Добавьте кнопку "Сбросить", которая сбрасывает seconds в 0.

const Timer = () => {
  const [seconds, setSeconds] = useState(0);

  // Реализуйте useEffect с интервалом и очисткой

  return (
    <div>
      <p>Прошло секунд: {seconds}</p>
      {/* Кнопка сброса */}
    </div>
  );
};

export default Timer;
