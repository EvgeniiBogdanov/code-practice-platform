import { useState } from "react";

const INITIAL_TODOS = [
  { id: "1", text: "Изучить React", completed: true },
  { id: "2", text: "Написать тесты", completed: false },
];

const TodoApp = () => {
  const [todos, setTodos] = useState(INITIAL_TODOS);
  const [text, setText] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    const newTodo = {
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
    };

    setTodos((prev) => [...prev, newTodo]);
    setText("");
  };

  const handleToggle = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDelete = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      <h3>Список задач</h3>
      <form onSubmit={handleAdd}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Новая задача..."
        />
        <button type="submit">Добавить</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
            />
            <span>{todo.text} {todo.completed ? "(выполнено)" : ""}</span>
            <button onClick={() => handleDelete(todo.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
