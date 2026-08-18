import React, { useRef, useState } from 'react';

/**
 * Собеседование: React + TypeScript
 * 
 * КОНТЕКСТ:
 * В компоненте секундомера с полем ввода используются две ссылки через `useRef`:
 * 1. `inputRef` — для управления фокусом DOM-элемента инпута
 * 2. `timerRef` — для сохранения и очистки числового идентификатора таймера (`setInterval`)
 *
 * ПРОБЛЕМА:
 * При попытке записать ID таймера в `timerRef.current` компилятор TypeScript выдает ошибку:
 * "Cannot assign to 'current' because it is a read-only property".
 *
 * ТРЕБОВАНИЯ:
 * 1. Разберитесь в перегрузках хука `useRef` и устраните ошибку компиляции.
 * 2. Ссылка для таймера должна быть мутируемой и позволять сохранять, обновлять и очищать ID интервала.
 * 3. DOM-ссылка на инпут должна оставаться строго привязанной к HTML-элементу для безопасного вызова методов фокуса.
 */

export function TimerWithFocus() {
  const [seconds, setSeconds] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  
  const timerRef = useRef<number>(null);

  const startTimer = () => {
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
