import React, { useState } from 'react';

/**
 * Задача: Error Boundary
 *
 * Сейчас ошибка в одном виджете роняет всё приложение — экран становится белым.
 *
 * Требования:
 * 1. Напишите компонент ErrorBoundary, который ловит ошибки рендера в своих потомках
 *    и показывает fallback вместо упавшего поддерева. Остальной интерфейс продолжает работать.
 * 2. Fallback показывает текст ошибки и кнопку «Попробовать снова», которая сбрасывает ошибку.
 * 3. Ошибка логируется (console.error с component stack) — как будто отправляется в мониторинг.
 * 4. Оберните каждый виджет в свою границу, чтобы падение одного не задевало другой.
 * 5. Ответьте в комментарии: почему кнопка «Ошибка в обработчике» не попадает в Error Boundary?
 */

const BuggyCounter = () => {
  const [count, setCount] = useState(0);
  if (count === 3) throw new Error('Счётчик сломался на значении 3');
  return <button onClick={() => setCount((c) => c + 1)}>Кликов: {count} (упадёт на 3)</button>;
};

const HandlerError = () => (
  <button
    onClick={() => {
      throw new Error('Ошибка в обработчике');
    }}
  >
    Ошибка в обработчике
  </button>
);

const App = () => (
  <div>
    <h3>Дашборд</h3>
    <BuggyCounter />
    <HandlerError />
    <p>Этот текст должен оставаться на экране</p>
  </div>
);

export default App;
