import { useState } from 'react';

const TripleCounter = () => {
  const [count, setCount] = useState(0);

  const handleAddTriple = () => {
    // Используем функциональное обновление три раза подряд,
    // чтобы каждый вызов зависел от актуального предыдущего значения состояния
    setCount((prevCount) => prevCount + 1);
    setCount((prevCount) => prevCount + 1);
    setCount((prevCount) => prevCount + 1);
  };

  return (
    <div>
      <p>Счетчик: {count}</p>
      <button onClick={handleAddTriple}>Добавить 3</button>
    </div>
  );
};

export default TripleCounter;
