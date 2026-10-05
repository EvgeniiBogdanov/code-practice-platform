import React, { useRef, useState } from 'react';

/**
 * Собеседование: React + TypeScript (React 19)
 *
 * КОНТЕКСТ:
 * Проект обновили до React 19 и @types/react 19. Компонент ниже раньше компилировался,
 * а теперь TypeScript выдаёт несколько ошибок.
 *
 * ТРЕБОВАНИЯ:
 * 1. Исправьте все ошибки компиляции без `any`, приведений `as` и `@ts-ignore`.
 * 2. `inputRef` ссылается на DOM-инпут; кнопка «Фокус» не падает, если инпута ещё нет.
 * 3. `timerRef` хранит ID интервала: повторный «Старт» не создаёт второй интервал,
 *    «Стоп» очищает интервал и сбрасывает ссылку. При размонтировании интервал тоже очищается.
 * 4. Ширина панели измеряется через ResizeObserver внутри ref callback.
 *    Наблюдатель отключается в cleanup-функции, которую возвращает ref callback (новое в React 19).
 */

export function TimerWithFocus() {
  const [seconds, setSeconds] = useState(0);
  const [width, setWidth] = useState(0);

  const inputRef = useRef<HTMLInputElement>();
  const timerRef = useRef<number>();
  const panelRef = useRef<HTMLDivElement | null>(null);

  const startTimer = () => {
    timerRef.current = window.setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  return (
    <div ref={(node) => (panelRef.current = node)}>
      <input ref={inputRef} type="text" placeholder="Инпут для фокуса" />
      <button onClick={() => inputRef.current.focus()}>Фокус</button>

      <p>Прошло секунд: {seconds}</p>
      <p>Ширина панели: {width}px</p>
      <button onClick={startTimer}>Старт</button>
      <button onClick={stopTimer}>Стоп</button>
    </div>
  );
}

export default TimerWithFocus;
