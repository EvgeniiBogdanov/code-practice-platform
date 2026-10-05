import React, { useState, useCallback } from "react";

// Дочерний компонент защищен React.memo: он перерисовывается только если изменился проп onIncrement
const IncrementButton = React.memo(({ onIncrement }) => {
  return <button onClick={onIncrement}>Увеличить</button>;
});

const SimpleCounter = () => {
  const [count, setCount] = useState(0);

  // Благодаря (prev) => prev + 1 нам не нужно добавлять count в зависимости.
  // Ссылка на эту функцию создастся один раз при монтировании и больше не изменится,
  // поэтому IncrementButton не делает лишних рендеров при изменении count.
  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  return (
    <div>
      <p>Счетчик: {count}</p>
      <IncrementButton onIncrement={increment} />
    </div>
  );
};

export default SimpleCounter;
