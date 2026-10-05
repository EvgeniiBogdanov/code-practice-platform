import React, { useCallback, useEffect, useRef, useState } from 'react';

//  РЕШЕНИЕ:
export function TimerWithFocus() {
  const [seconds, setSeconds] = useState(0);
  const [width, setWidth] = useState(0);

  // 1. В @types/react 19 useRef требует аргумент: useRef<T>() больше не компилируется.
  //    DOM-ссылка: RefObject<HTMLInputElement | null>, значение проставляет React.
  const inputRef = useRef<HTMLInputElement>(null);

  // 2. Хранилище ID интервала. В React 19 RefObject.current можно перезаписывать,
  //    MutableRefObject объявлен устаревшим — нужен только явный `| null` в типе.
  const timerRef = useRef<number | null>(null);

  // 3. Ref callback может вернуть cleanup-функцию (React 19).
  //    useCallback сохраняет ссылку на колбэк, чтобы наблюдатель не пересоздавался на каждый рендер.
  const measurePanel = useCallback((node: HTMLDivElement) => {
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.round(entry.contentRect.width));
    });
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const stopTimer = () => {
    if (timerRef.current === null) return;
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const startTimer = () => {
    if (timerRef.current !== null) return;
    timerRef.current = window.setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  // 5. Интервал не должен пережить компонент
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div ref={measurePanel}>
      <input ref={inputRef} type="text" placeholder="Инпут для фокуса" />
      {/* 4. current может быть null — опциональная цепочка вместо падения */}
      <button onClick={() => inputRef.current?.focus()}>Фокус</button>

      <p>Прошло секунд: {seconds}</p>
      <p>Ширина панели: {width}px</p>
      <button onClick={startTimer}>Старт</button>
      <button onClick={stopTimer}>Стоп</button>
    </div>
  );
}

export default TimerWithFocus;
