import React, { useEffect, useState } from 'react';

/**
 * Задача: Серверное состояние на TanStack Query
 *
 * Сейчас каждый компонент сам загружает данные через useEffect + useState:
 * - TodoList и TodoCount делают ДВА одинаковых запроса;
 * - после добавления задачи TodoCount показывает устаревшее число;
 * - загрузку, ошибки и повторный запрос приходится писать вручную.
 *
 * Требования:
 * 1. Подключите QueryClientProvider. QueryClient создайте на уровне модуля, а не в компоненте.
 * 2. Загрузку списка реализуйте через useQuery({ queryKey: ['todos'], queryFn: api.getTodos }).
 *    Обработайте isPending и isError.
 * 3. TodoList и TodoCount используют один и тот же queryKey —
 *    при монтировании уходит ОДИН запрос (смотрите счётчик запросов).
 * 4. Добавление задачи — через useMutation. После успеха инвалидируйте ['todos'],
 *    чтобы обновились оба компонента. Кнопка заблокирована, пока мутация выполняется,
 *    ошибка мутации показывается под формой.
 * 5. Задайте staleTime 30 секунд и ответьте в комментарии: чем staleTime отличается от gcTime?
 */

// Фейковый сервер: хранит задачи в памяти, отвечает с задержкой и считает запросы списка
let serverTodos = [{ id: 1, title: 'Изучить useQuery' }];

export const api = {
  calls: 0,
  getTodos: () => {
    api.calls += 1;
    return new Promise((resolve) => setTimeout(() => resolve([...serverTodos]), 500));
  },
  addTodo: (title) =>
    new Promise((resolve, reject) =>
      setTimeout(() => {
        if (!title.trim()) return reject(new Error('Название задачи не может быть пустым'));
        const todo = { id: Date.now(), title: title.trim() };
        serverTodos = [...serverTodos, todo];
        resolve(todo);
      }, 500)
    ),
};

const TodoCount = () => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    api.getTodos().then((todos) => setCount(todos.length));
  }, []);

  return <p>Всего задач: {count ?? '...'}</p>;
};

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const load = () => {
    setIsLoading(true);
    api.getTodos().then(setTodos).finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    await api.addTodo(title);
    setTitle('');
    setIsAdding(false);
    load();
  };

  if (isLoading) return <p>Загрузка...</p>;

  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Новая задача" />
        <button disabled={isAdding}>Добавить</button>
      </form>
      <p>Запросов списка к серверу: {api.calls}</p>
    </div>
  );
};

export default function App() {
  return (
    <div>
      <TodoCount />
      <TodoList />
    </div>
  );
}
