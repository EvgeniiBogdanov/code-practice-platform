import React, { useState } from "react";

// **Оптимизируйте компонент с помощью useCallback и React.memo**

// **Требования:**
// - Оберните дочерний компонент IncrementButton в React.memo, чтобы избежать лишних ререндеров.
// - Оберните функцию increment в useCallback с пустым массивом зависимостей [] (используя функциональное обновление).
// - Передайте мемоизированный колбэк в IncrementButton.

const IncrementButton = ({ onIncrement }) => {
  return <button onClick={onIncrement}>Увеличить</button>;
};

const SimpleCounter = () => {
  const [count, setCount] = useState(0);

  // Без useCallback эта функция пересоздается при каждом рендере,
  // что ломает оптимизацию React.memo у дочернего компонента
  const increment = () => {
    setCount((prev) => prev + 1);
  };

  return (
    <div>
      <p>Счетчик: {count}</p>
      <IncrementButton onIncrement={increment} />
    </div>
  );
};

export default SimpleCounter;