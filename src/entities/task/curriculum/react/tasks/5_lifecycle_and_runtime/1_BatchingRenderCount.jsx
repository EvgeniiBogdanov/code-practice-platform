// React 19: Автоматический батчинг обновлений состояния
// Среда: Browser DOM, Production (без StrictMode)
// Пользователь один раз нажал кнопку.
// 1. Что выведется в консоль и в каком порядке?
// 2. Сколько раз отрендерится компонент после клика и какое значение count будет на экране?

import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  console.log("render", count);

  const handleClick = () => {
    setCount(count + 1);
    setCount(count + 1);
    console.log("handler", count);

    setTimeout(() => {
      setCount((prev) => prev + 1);
      setCount((prev) => prev + 1);
      console.log("timeout", count);
    }, 0);
  };

  return <button onClick={handleClick}>count: {count}</button>;
}
