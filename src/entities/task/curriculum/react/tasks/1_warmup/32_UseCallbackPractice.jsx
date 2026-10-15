import React, { useState } from "react";

// **Оптимизируйте компонент с помощью useCallback и React.memo**

const IncrementButton = ({ onIncrement }) => {
  return <button onClick={onIncrement}>Увеличить</button>;
};

const SimpleCounter = () => {
  const [count, setCount] = useState(0);

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
