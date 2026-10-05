// Проведите рефакторинг: при вводе цвета интерфейс заметно тормозит,
// потому что каждое нажатие клавиши заново рендерит медленный ExpensiveTree.
// Ускорьте ввод, НЕ используя React.memo, useMemo и useCallback.

import React, { useState } from 'react';

function ExpensiveTree() {
  const start = performance.now();
  while (performance.now() - start < 100) {
    // Имитация тяжёлого рендера: ~100 мс
  }
  return <p>Я очень медленный компонент</p>;
}

export default function App() {
  const [color, setColor] = useState('#ff0000');

  return (
    <div style={{ border: `4px solid ${color}`, padding: 16 }}>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      <p style={{ color }}>Привет, мир!</p>
      <ExpensiveTree />
    </div>
  );
}
