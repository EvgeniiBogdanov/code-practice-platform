import { useState } from "react";

// **Реализуйте базовые операции с массивом задач (CRUD)**

// **Требования:**
// 1. Добавление новой задачи: по сабмиту формы добавляется объект { id: crypto.randomUUID(), text, completed: false }.
// 2. Переключение статуса: по клику на чекбокс статус completed меняется на противоположный (иммутабельно через .map()).
// 3. Удаление задачи: по кнопке "Удалить" задача удаляется из массива (иммутабельно через .filter()).
// 4. Поле ввода очищается после добавления задачи.
// 5. Текст задачи обрезается по краям (trim); пустая задача не добавляется.
// 6. Выполненная задача помечается текстом «(выполнено)» рядом с названием.

const INITIAL_TODOS = [
  { id: "1", text: "Изучить React", completed: true },
  { id: "2", text: "Написать тесты", completed: false },
];

const TodoApp = () => {
  const [todos, setTodos] = useState(INITIAL_TODOS);
  const [text, setText] = useState("");

  // Напишите функции handleAdd, handleToggle, handleDelete

  return (
    <div>
      <h3>Список задач</h3>
      {/* Реализуйте форму добавления и отображение списка */}
    </div>
  );
};

export default TodoApp;
