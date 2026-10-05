import React from 'react';
import { create } from 'zustand';

/**
 * Задача: Стор задач на Zustand
 *
 * Требования:
 * 1. Создайте стор useTodoStore через create со стейтом { todos: [], filter: 'all' }
 *    и действиями addTodo(text), toggleTodo(id), setFilter(filter).
 *    Состояние обновляется иммутабельно через set.
 * 2. Компоненты подписываются только на нужную часть стора через селекторы:
 *    - FilterBar не должен перерисовываться при добавлении задачи;
 *    - Counter перерисовывается только когда меняется число невыполненных задач.
 * 3. Не используйте useTodoStore() без селектора: такая подписка на весь стор
 *    перерисовывает компонент при любом изменении.
 * 4. Отфильтрованный список вычисляйте в компоненте, а не храните в сторе.
 */

export const useTodoStore = create((set) => ({
  // Напишите стор здесь
}));

const AddTodo = () => <input placeholder="Новая задача + Enter" />;
const FilterBar = () => <div>{/* all / active / done */}</div>;
const Counter = () => <p>Осталось: {/* число */}</p>;
const TodoList = () => <ul>{/* задачи */}</ul>;

const App = () => (
  <div>
    <AddTodo />
    <FilterBar />
    <TodoList />
    <Counter />
  </div>
);

export default App;
