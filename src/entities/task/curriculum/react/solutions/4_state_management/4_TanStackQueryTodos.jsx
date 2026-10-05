import React, { useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

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

// Клиент создаётся один раз на уровне модуля: внутри компонента кеш пересоздавался бы при каждом рендере.
// staleTime — сколько данные считаются свежими: в это время повторный запрос не делается.
// gcTime — сколько неиспользуемые данные хранятся в кеше после размонтирования всех подписчиков (по умолчанию 5 минут).
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000 } },
});

const TODOS_KEY = ['todos'];

// Один хук — один ключ: все компоненты читают общий кеш
const useTodos = () => useQuery({ queryKey: TODOS_KEY, queryFn: api.getTodos });

const TodoCount = () => {
  const { data } = useTodos();
  return <p>Всего задач: {data?.length ?? '...'}</p>;
};

const TodoList = () => {
  const queryClient = useQueryClient();
  const { data: todos, isPending, isError, error } = useTodos();
  const [title, setTitle] = useState('');

  const addTodo = useMutation({
    mutationFn: api.addTodo,
    onSuccess: () => {
      setTitle('');
      // Помечаем список устаревшим: активные запросы перезапросятся, обновятся оба компонента
      return queryClient.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });

  if (isPending) return <p>Загрузка...</p>;
  if (isError) return <p>Ошибка: {error.message}</p>;

  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTodo.mutate(title);
        }}
      >
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Новая задача" />
        <button disabled={addTodo.isPending}>{addTodo.isPending ? 'Добавляем...' : 'Добавить'}</button>
      </form>
      {addTodo.isError && <p role="alert">{addTodo.error.message}</p>}
      <p>Запросов списка к серверу: {api.calls}</p>
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoCount />
      <TodoList />
    </QueryClientProvider>
  );
}
