import { useEffect } from "react";

export default function App() {
  console.log(0); // 0 (1. Render Phase — синхронное выполнение тела компонента)

  useEffect(() => {
    console.log(1); // 1 (3. Post-commit Phase — асинхронно после paint экрана)
  });

  return (
    <div
      ref={(node) => {
        console.log(2); // 2 (2. Commit Phase — синхронно при привязке DOM-узла)
      }}
      id="app"
    >
      Hello!
    </div>
  );
}

// Порядок вывода (React 19, Production):
// 0, 2, 1
//
// Примечание:
// 1. В React 19 ref callback поддерживает возврат cleanup-функции: ref={(el) => () => { ... }}.
// 2. В React StrictMode (Dev) порядок будет: 0, 2, 1, [cleanup], 0, 2, 1 из-за двойного монтирования.
