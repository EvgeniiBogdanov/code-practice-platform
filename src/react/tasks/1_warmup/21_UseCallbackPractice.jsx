import { useState } from "react";

// **Создай функцию-обработчик с помощью useCallback**

// **Требования:**
// - Создать состояние счетчика (count).
// - Написать функцию `increment` для увеличения счетчика на 1.
// - Обернуть функцию `increment` в useCallback так, чтобы её ссылка никогда не менялась (использовать функциональное обновление состояния).
// - Отрисовать кнопку, вызывающую эту функцию, и само значение счетчика.

// Вводные:
// const SimpleCounter = () => {};

const SimpleCounter = () => {
  const [count, setCount] = useState(0);

  // Без useCallback эта функция будет создаваться с новой ссылкой
  // в памяти при каждом рендере компонента SimpleCounter.
  const increment = () => {
    setCount((prev) => prev + 1);
  };

  return (
    <div>
      <p>Счетчик: {count}</p>
      <button onClick={increment}>Увеличить</button>
    </div>
  );
};

export default SimpleCounter;