import { useState } from 'react';

const initialData = {
  today: [
    { id: 1, text: 'Полить цветы' },
    { id: 2, text: 'Помыть машину' },
    { id: 3, text: 'Выкинуть мусор' },
  ],
  tomorrow: [],
};

const SECTIONS = [
  { key: 'today', title: 'Сегодня' },
  { key: 'tomorrow', title: 'Завтра' },
];

// Одна секция = список + своё поле ввода. Черновик — локальное состояние секции
const TodoSection = ({ title, items, onAdd, onDelete }) => {
  const [draft, setDraft] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onAdd(text);
    setDraft('');
  };

  return (
    <section>
      <h2>{title}:</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.text} <button onClick={() => onDelete(item.id)}>Удалить</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Новая задача..." />
        <button type="submit">Добавить</button>
      </form>
    </section>
  );
};

export default function TodoListSber() {
  // Списки — в едином объекте состояния
  const [todos, setTodos] = useState(initialData);

  // Обработчики параметризованы ключом списка — без дублирования для today и tomorrow
  const addTask = (listKey, text) => {
    setTodos((prev) => ({
      ...prev,
      [listKey]: [...prev[listKey], { id: crypto.randomUUID(), text }],
    }));
  };

  const deleteTask = (listKey, id) => {
    setTodos((prev) => ({
      ...prev,
      [listKey]: prev[listKey].filter((item) => item.id !== id),
    }));
  };

  return (
    <div>
      {SECTIONS.map(({ key, title }) => (
        <TodoSection
          key={key}
          title={title}
          items={todos[key]}
          onAdd={(text) => addTask(key, text)}
          onDelete={(id) => deleteTask(key, id)}
        />
      ))}
    </div>
  );
}
