// Проведите рефакторинг: TodoItem обёрнут в React.memo, а onRemove — в useCallback,
// но при каждом клике «Кликнуть» все задачи всё равно перерисовываются (смотрите console.log).
// Найдите, что ломает мемоизацию, и исправьте.

import React, { memo, useCallback, useState } from 'react';

const TodoItem = memo(({ todo, onRemove, style, children }) => {
  console.log(`Рендер задачи: ${todo.text}`);
  return (
    <li style={style}>
      {todo.text} {children}
      <button onClick={() => onRemove(todo.id)}>Удалить</button>
    </li>
  );
});

export default function TodoApp() {
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState([
    { id: 1, text: '  Выучить React  ' },
    { id: 2, text: 'Понять React.memo' },
  ]);

  const handleRemove = useCallback((id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }, []);

  return (
    <div>
      <h2>Счетчик кликов: {count}</h2>
      <button onClick={() => setCount((prev) => prev + 1)}>Кликнуть</button>

      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={{ ...todo, text: todo.text.trim() }}
            onRemove={handleRemove}
            style={{ padding: 4 }}
          >
            <span>⭐</span>
          </TodoItem>
        ))}
      </ul>
    </div>
  );
}
