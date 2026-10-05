import React, { memo, useCallback, useState } from 'react';

//  ПРАВИЛЬНО: константы вынесены за пределы компонента — ссылка одна на всё время жизни модуля
const ITEM_STYLE = { padding: 4 };

const TodoItem = memo(({ todo, onRemove }) => {
  console.log(`Рендер задачи: ${todo.text}`);
  return (
    //  ПРАВИЛЬНО: статичная разметка (⭐) живёт внутри ребёнка, а не приходит через children
    <li style={ITEM_STYLE}>
      {todo.text} <span>⭐</span>
      <button onClick={() => onRemove(todo.id)}>Удалить</button>
    </li>
  );
});

export default function TodoApp() {
  const [count, setCount] = useState(0);
  //  ПРАВИЛЬНО: данные нормализуются один раз при создании, а не новым объектом на каждом рендере
  const [todos, setTodos] = useState(() =>
    [
      { id: 1, text: '  Выучить React  ' },
      { id: 2, text: 'Понять React.memo' },
    ].map((todo) => ({ ...todo, text: todo.text.trim() }))
  );

  const handleRemove = useCallback((id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }, []);

  return (
    <div>
      <h2>Счетчик кликов: {count}</h2>
      <button onClick={() => setCount((prev) => prev + 1)}>Кликнуть</button>

      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onRemove={handleRemove} />
        ))}
      </ul>
    </div>
  );
}
