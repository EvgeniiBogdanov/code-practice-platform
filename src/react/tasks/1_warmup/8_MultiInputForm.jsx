import { useState } from "react";

// Задача:
// 1. В текущем компоненте есть 3 поля ввода (имя, email, город).
// 2. Сейчас для каждого инпута объявлено отдельное состояние (name, email, city) и 3 отдельных функции-обработчика.
// 3. Перепишите код: объедините состояние в один объект
//    и создайте ЕДИНЫЙ универсальный обработчик, который обновляет поля.

const MultiInputForm = () => {
  // Плохой подход: 3 отдельных состояния для полей
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");

  // И 3 отдельные функции для каждого поля:
  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleCityChange = (e) => setCity(e.target.value);

  return (
    <div>
      <input
        name="name"
        value={name}
        onChange={handleNameChange}
        placeholder="Имя"
      />
      <input
        name="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Email"
      />
      <input
        name="city"
        value={city}
        onChange={handleCityChange}
        placeholder="Город"
      />
      <p>Имя: {name}</p>
      <p>Email: {email}</p>
      <p>Город: {city}</p>
    </div>
  );
};

export default MultiInputForm;
