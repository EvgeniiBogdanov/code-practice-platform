import { useState } from "react";

const initialData = {
  today: [
    { id: 1, text: "Полить цветы" },
    { id: 2, text: "Помыть машину" },
    { id: 3, text: "Выкинуть мусор" },
  ],
  tomorrow: [],
};

export default function TodoListSber() {
  const [todo, setTodo] = useState(initialData);
  const [today, setToday] = useState("");
  const [tomorrow, setTomorrow] = useState("");

  const addToday = () => {
    if (today.trim() === "") return;

    const item = {
      id: Date.now(),
      text: today,
    };

    setTodo((prev) => ({
      ...prev,
      today: [...prev.today, item],
    }));

    setToday("");
  };

  const deleteToday = (id) => {
    setTodo((prev) => ({
      ...prev,
      today: prev.today.filter((item) => item.id !== id),
    }));
  };

  const addTomorrow = () => {
    if (tomorrow.trim() === "") return;

    const item = {
      id: Date.now(),
      text: tomorrow,
    };

    setTodo((prev) => ({
      ...prev,
      tomorrow: [...prev.tomorrow, item],
    }));

    setTomorrow("");
  };

  const deleteTomorrow = (id) => {
    setTodo((prev) => ({
      ...prev,
      tomorrow: prev.tomorrow.filter((item) => item.id !== id),
    }));
  };

  return (
    <div>
      {/* Секция Сегодня */}
      <div>
        <h2>Сегодня:</h2>
        <ul>
          {!!todo.today.length && todo.today.map((item) => (
            <li key={item.id} style={{ marginBottom: "8px" }}>
              <span style={{ marginRight: "12px" }}>{item.text}</span>
              <button onClick={() => deleteToday(item.id)}>Удалить</button>
            </li>
          ))}
        </ul>
        <div>
          <input
            value={today}
            onChange={(e) => setToday(e.target.value)}
            placeholder="Новая задача..."
          />
          <button onClick={addToday}>Добавить</button>
        </div>
      </div>

      {/* Секция Завтра */}
      <div>
        <h2>Завтра:</h2>
        <ul>
          {!!todo.tomorrow.length && todo.tomorrow.map((item) => (
            <li key={item.id} style={{ marginBottom: "8px" }}>
              <span style={{ marginRight: "12px" }}>{item.text}</span>
              <button onClick={() => deleteTomorrow(item.id)}>Удалить</button>
            </li>
          ))}
        </ul>
        <div>
          <input
            value={tomorrow}
            onChange={(e) => setTomorrow(e.target.value)}
            placeholder="Новая задача..."
          />
          <button onClick={addTomorrow}>Добавить</button>
        </div>
      </div>
    </div>
  );
}
