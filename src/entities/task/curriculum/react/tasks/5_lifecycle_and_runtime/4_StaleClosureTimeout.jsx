// React 19: Устаревшее замыкание (stale closure)
// Пользователь нажимает «Показать через 3 секунды», а затем быстро три раза «+1».
// 1. Какое значение покажет alert и почему?
// 2. Исправьте компонент так, чтобы alert показывал актуальное значение на момент срабатывания.

import { useState } from "react";

export default function DelayedAlert() {
  const [count, setCount] = useState(0);

  const showLater = () => {
    setTimeout(() => {
      alert(`Счётчик: ${count}`);
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
