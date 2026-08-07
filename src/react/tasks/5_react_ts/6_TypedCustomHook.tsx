import React, { useState } from 'react';

// ❌ ОШИБКА / ЗАДАЧА:
// Хук useToggle возвращает обычный массив [value, toggle].
// TypeScript выводит тип возвращаемого значения как (boolean | (() => void))[],
// из-за чего при вызове `const [isOn, toggle] = useToggle()` переменная `isOn`
// имеет тип `boolean | (() => void)`, и её нельзя напрямую передать в JSX или условие!
//
// Требования:
// Использовать `as const` или явно указать возвращаемый тип кортежа (tuple).

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue((prev) => !prev);

  // ❌ Без as const возвращается обычный массив
  return [value, toggle];
}

export default function Demo() {
  const [isOn, toggle] = useToggle(false);

  return (
    <div>
      {/* ❌ TypeScript выдает ошибку, так как isOn не строго boolean */}
      <p>Состояние: {isOn ? 'Включено' : 'Выключено'}</p>
      <button onClick={toggle}>Переключить</button>
    </div>
  );
}
