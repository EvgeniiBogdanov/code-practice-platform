import { useState, useCallback } from "react";

const SimpleCounter = () => {
  const [count, setCount] = useState(0);

  // Благодаря (prev) => prev + 1 нам не нужно добавлять count в зависимости.
  // Ссылка на эту функцию создастся один раз при монтировании и больше не изменится.
  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  return (
    <div>
      <p>Счетчик: {count}</p>
      <button onClick={increment}>Увеличить</button>
    </div>
  );
};

export default SimpleCounter;
