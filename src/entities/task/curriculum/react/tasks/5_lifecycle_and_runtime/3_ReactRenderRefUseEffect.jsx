// React 19: Жизненный цикл и порядок вызова Render, Ref Callback и useEffect
// Среда: Browser DOM (клиентский рендеринг)
// Режим: Production (в Dev StrictMode рендер и эффекты вызываются повторно)
// В каком порядке выведутся числа при монтировании компонента?

import { useEffect } from "react";

export default function App() {
  console.log(0);

  useEffect(() => {
    console.log(1);
  });

  return (
    <div
      ref={(node) => {
        console.log(2);
      }}
      id="app"
    >
      Hello!
    </div>
  );
}
