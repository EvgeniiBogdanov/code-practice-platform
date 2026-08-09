/* Что проверяет: Понимание того, как работает ссылочная идентичность (referential equality) функций в JavaScript, 
и как она ломает мемоизацию (React.memo) дочерних компонентов. */

/* В чем подвох: Дочерний компонент обернут в React.memo, но всё равно перерисовывается, когда меняется состояние 
родителя, не связанное с этим компонентом. */

import React, { useState } from 'react';

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

  const handleRemove = (id) => {
    setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== id));
  };

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