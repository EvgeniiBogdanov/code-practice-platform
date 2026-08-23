import { useState } from 'react';

const TodoList = () => {
  const [todos, setTodos] = useState(['Купить продукты']);
  const [inputValue, setInputValue] = useState('');

  const handleAddTodo = () => {
    if (inputValue.trim() === '') return;

    // Создаем новый массив на основе старого, избегая прямой мутации через .push()
    setTodos((prevTodos) => [...prevTodos, inputValue]);
    setInputValue(''); // Очищаем поле ввода
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Новая задача..."
      />
      <button onClick={handleAddTodo}>Добавить</button>

      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
