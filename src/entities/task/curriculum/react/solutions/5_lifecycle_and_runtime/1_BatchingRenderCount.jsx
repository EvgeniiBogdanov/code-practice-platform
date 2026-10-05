import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  console.log("render", count);

  const handleClick = () => {
    setCount(count + 1); // count === 0 → поставить 1
    setCount(count + 1); // count всё ещё 0 → снова поставить 1
    console.log("handler", count); // handler 0: setState не меняет переменную сразу

    setTimeout(() => {
      // Замыкание первого рендера: count здесь тоже 0
      setCount((prev) => prev + 1); // 1 → 2
      setCount((prev) => prev + 1); // 2 → 3
      console.log("timeout", count); // timeout 0
    }, 0);
  };

  return <button onClick={handleClick}>count: {count}</button>;
}

// Ответ:
// render 0      ← первый рендер при монтировании
// handler 0     ← два setCount(count + 1) объединены в один рендер (батчинг)
// render 1      ← рендер после обработчика: оба вызова поставили значение 1
// timeout 0     ← setTimeout видит count из замыкания первого рендера
// render 3      ← в React 18+ батчинг автоматический и внутри setTimeout:
//                 два функциональных обновления → один рендер, 1 → 2 → 3
//
// Итого после клика: 2 рендера, на экране count: 3.
// В React 17 внутри setTimeout батчинга не было: было бы render 2, render 3.
