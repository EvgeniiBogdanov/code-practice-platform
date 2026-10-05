import React, { useState } from 'react';
import { create } from 'zustand';

export const useTodoStore = create((set) => ({
  todos: [],
  filter: 'all',
  addTodo: (text) =>
    set((state) => ({ todos: [...state.todos, { id: crypto.randomUUID(), text, done: false }] })),
  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    })),
  setFilter: (filter) => set({ filter }),
}));

const AddTodo = () => {
  const [text, setText] = useState('');
  // Действия в сторе стабильны — подписка на них не вызывает ререндеров
  const addTodo = useTodoStore((state) => state.addTodo);

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter' || !text.trim()) return;
    addTodo(text.trim());
    setText('');
  };

  return (
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Новая задача + Enter"
    />
  );
};

const FilterBar = () => {
  // Подписка только на filter и setFilter: добавление задач этот компонент не задевает
  const filter = useTodoStore((state) => state.filter);
  const setFilter = useTodoStore((state) => state.setFilter);

  return (
    <div>
      {['all', 'active', 'done'].map((f) => (
        <button key={f} disabled={filter === f} onClick={() => setFilter(f)}>
          {f}
        </button>
      ))}
    </div>
  );
};

const Counter = () => {
  // Селектор возвращает число: Zustand сравнивает результат через Object.is,
  // поэтому ререндер будет только при изменении самого числа
  const activeCount = useTodoStore((state) => state.todos.filter((t) => !t.done).length);
  return <p>Осталось: {activeCount}</p>;
};

const TodoList = () => {
  const todos = useTodoStore((state) => state.todos);
  const filter = useTodoStore((state) => state.filter);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);

  // Производные данные вычисляются при рендере, а не хранятся в сторе
  const visible = todos.filter((t) => (filter === 'all' ? true : filter === 'done' ? t.done : !t.done));

  return (
    <ul>
      {visible.map((t) => (
        <li key={t.id} onClick={() => toggleTodo(t.id)} style={{ textDecoration: t.done ? 'line-through' : 'none' }}>
          {t.text}
        </li>
      ))}
    </ul>
  );
};

const App = () => (
  <div>
    <AddTodo />
    <FilterBar />
    <TodoList />
    <Counter />
  </div>
);

export default App;
