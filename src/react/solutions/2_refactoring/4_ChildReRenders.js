import React, { useState, useCallback } from 'react';

// Дочерний компонент обернут в React.memo (ожидаем, что он не будет лишний раз рендериться)
const TodoItem = React.memo(({ todo, onRemove }) => {
  console.log(`Рендер задачи: ${todo.text}`);
  return (
    <li>
      {todo.text} <button onClick={() => onRemove(todo.id)}>Удалить</button>
    </li>
  );
});

export default function TodoApp() {
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState([
    { id: 1, text: 'Выучить React' },
    { id: 2, text: 'Понять useCallback' }
  ]);

  //  ПРАВИЛЬНО: Функция сохраняет ссылку между рендерами.
  // Пустой массив зависимостей, так как мы используем колбэк в setTodos
  const handleRemove = useCallback((id) => {
    setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== id));
  }, []); 

  return (
    <div>
      <h2>Счетчик кликов: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Кликнуть</button>
      
      <ul>
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} onRemove={handleRemove} />
        ))}
      </ul>
    </div>
  );
}

/*
=== Разбор решения ===
При каждом изменении count родительский компонент рендерится заново. При рендере функция handleRemove создается как абсолютно новый объект в памяти. Когда React сравнивает старые пропсы TodoItem с новыми (oldProps.onRemove === newProps.onRemove), он получает false и перерисовывает все задачи. Чтобы сохранить ссылку на функцию между рендерами, нужен useCallback.

Как надо (Рефакторинг): Оборачиваем обработчик в useCallback.
*/
