import React, { useState } from 'react';

function ExpensiveTree() {
  const start = performance.now();
  while (performance.now() - start < 100) {
    // Имитация тяжёлого рендера: ~100 мс
  }
  return <p>Я очень медленный компонент</p>;
}

//  ПРАВИЛЬНО: состояние цвета живёт только там, где оно нужно.
// ExpensiveTree приходит снаружи через children, поэтому при смене цвета
// ColorFrame получает тот же самый React-элемент и не рендерит его заново.
function ColorFrame({ children }) {
  const [color, setColor] = useState('#ff0000');

  return (
    <div style={{ border: `4px solid ${color}`, padding: 16 }}>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      <p style={{ color }}>Привет, мир!</p>
      {children}
    </div>
  );
}

//  App больше не хранит состояние и не перерендеривается при вводе
export default function App() {
  return (
    <ColorFrame>
      <ExpensiveTree />
    </ColorFrame>
  );
}
