import React, { useRef, useState } from 'react';

// ❌ ОШИБКА / ЗАДАЧА:
// В компоненте используются два рефа:
// 1. inputRef — для привязки к HTMLInputElement
// 2. timerRef — для сохранения id секундомера setInterval
// 
// Разработчик написал useRef<number>(null) и удивляется, почему 
// TypeScript выдает ошибку "Cannot assign to 'current' because it is a read-only property".
//
// Требования:
// Исправьте аннотацию типов дженерика useRef, чтобы timerRef.current был мутируемым (MutableRefObject),
// а inputRef.current оставался строго привязанным к DOM (RefObject).

export function TimerWithFocus() {
  const [seconds, setSeconds] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  
  // ❌ Ошибка TypeScript: useRef<number>(null) создаёт Readonly RefObject<number>!
  const timerRef = useRef<number>(null);

  const startTimer = () => {
    // ❌ Ошибка: Cannot assign to 'current' because it is a read-only property
    timerRef.current = window.setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Инпут для фокуса" />
      <button onClick={() => inputRef.current?.focus()}>Фокус</button>
      
      <p>Прошло секунд: {seconds}</p>
      <button onClick={startTimer}>Старт</button>
      <button onClick={stopTimer}>Стоп</button>
    </div>
  );
}

export default TimerWithFocus;
