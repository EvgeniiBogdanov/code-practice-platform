import { useState } from 'react';

const INITIAL_TODOS = [
  { id: '1', text: 'Изучить React', completed: false },
  { id: '2', text: 'Пройти собеседование', completed: false },
];

const TodoList = () => {
  const [todos, setTodos] = useState(INITIAL_TODOS);
  const [text, setText] = useState('');

  // Форма: добавление и по кнопке, и по Enter
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text: trimmed, completed: false }]);
    setText('');
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      <h2>Список задач</h2>
      <form onSubmit={handleSubmit}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Новая задача..." />
        <button type="submit">Добавить</button>
      </form>

      {todos.length === 0 ? (
        <p>Задач нет</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              {/* Кнопка, а не span: переключение доступно с клавиатуры и для скринридера */}
              <button
                type="button"
                aria-pressed={todo.completed}
                onClick={() => toggleTodo(todo.id)}
                style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              >
                {todo.text}
              </button>
              <button type="button" onClick={() => deleteTodo(todo.id)}>
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
