import { useEffect } from "react";

export default function App() {
  console.log(0); // 0 (тело функции-компонента)

  useEffect(() => {
    console.log(1); // 1 (после монтирования в DOM)
  });

  return (
    <div
      ref={() => {
        console.log(2); // 2 (ref callback при создании DOM-узла)
        return 0;
      }}
      id="app"
    >
      Hello!
    </div>
  );
}
// Порядок вывода: 0, 2, 1
