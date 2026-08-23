import { useState } from 'react';

const TodoList = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Изучить React', completed: false },
    { id: 2, text: 'Пройти собеседование', completed: false }
  ]);
  const [inputText, setInputText] = useState('');

  const addTodo = () => {
    if (inputText.trim() === '') return;
    setTodos([
      ...todos,
      { id: Date.now(), text: inputText.trim(), completed: false }
    ]);
    setInputText('');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div>
      <h2>Список задач</h2>
      <input 
        value={inputText} 
        onChange={(e) => setInputText(e.target.value)} 
        placeholder="Новая задача..."
      />
      <button onClick={addTodo}>Добавить</button>
      
      <ul>
        {!!todos.length && todos.map(todo => (
          <li key={todo.id}>
            <span 
              onClick={() => toggleTodo(todo.id)} 
              style={{ 
                textDecoration: todo.completed ? 'line-through' : 'none' 
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
