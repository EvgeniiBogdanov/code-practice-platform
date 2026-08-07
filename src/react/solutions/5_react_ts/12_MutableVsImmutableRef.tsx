import React, { useRef, useState } from 'react';

//  РЕШЕНИЕ:
export function TimerWithFocus() {
  const [seconds, setSeconds] = useState(0);

  // 1. DOM-элемент: useRef<HTMLInputElement>(null) -> Возвращает RefObject<HTMLInputElement> (current: readonly)
  // React сам управляет этим .current при монтировании DOM.
  const inputRef = useRef<HTMLInputElement>(null);

  // 2. Пользовательское значение: useRef<number | null>(null) -> Возвращает MutableRefObject<number | null>
  // Благодаря явному null в дженерике, .current становится перезаписываемым!
  const timerRef = useRef<number | null>(null);

  const startTimer = () => {
    if (timerRef.current !== null) return;

    timerRef.current = window.setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '300px' }}>
      <div>
        <input ref={inputRef} type="text" placeholder="Инпут для фокуса" />
        <button onClick={() => inputRef.current?.focus()}>Сделать фокус</button>
      </div>

      <p>Прошло секунд: {seconds}</p>
      <div>
        <button onClick={startTimer}>Старт</button>
        <button onClick={stopTimer} style={{ marginLeft: '8px' }}>Стоп</button>
      </div>
    </div>
  );
}

export default TimerWithFocus;

/*
=== Разбор решения ===
Проблема: В типизации React хук `useRef` имеет 3 ключевые перегрузки:
1. `useRef<T>(initialValue: T): MutableRefObject<T>` — мутируемый реф для хранения любых переменных.
2. `useRef<T>(initialValue: T | null): RefObject<T>` — неизменяемый Readonly реф, специально предназначенный для передачи в атрибут `ref={...}` DOM-элементов.

Как надо (React + TS):
- Передача `useRef<number>(null)` вызывает перегрузку №2, создавая Readonly реф `RefObject<number>`. Попытка записать `timerRef.current = ...` приводит к ошибке `read-only`.
- Для мутируемого рефа с начальным null нужно явно указывать тип с союзом null внутри дженерика: `useRef<number | null>(null)`. Это вызывает перегрузку №1 (`MutableRefObject`), давая полное право перезаписывать `.current`.
*/
