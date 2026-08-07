// Задача на жизненный цикл компонента в React.
// В каком порядке выведутся консоль логи при монтировании компонента?

import { useEffect } from "react";

export default function App() {
  console.log(0);

  useEffect(() => {
    console.log(1);
  });

  return (
    <div
      ref={() => {
        console.log(2);
        return 0;
      }}
      id="app"
    >
      Hello!
    </div>
  );
}
