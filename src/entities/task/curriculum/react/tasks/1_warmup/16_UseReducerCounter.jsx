import { useReducer } from "react";

// **Реализуйте счётчик с шагом на useReducer**

// **Требования:**
// 1. Состояние: { count: 0, step: 1 }.
// 2. Напишите чистую функцию reducer(state, action) с действиями:
//    - { type: "increment" } — увеличивает count на step;
//    - { type: "decrement" } — уменьшает count на step;
//    - { type: "setStep", payload: number } — меняет шаг;
//    - { type: "reset" } — возвращает начальное состояние.
// 3. На неизвестный action.type reducer выбрасывает ошибку.
// 4. Компонент вызывает dispatch и не меняет состояние напрямую.
// 5. Шаг не может быть меньше 1: любое меньшее значение из инпута заменяется на 1.

const initialState = { count: 0, step: 1 };

const reducer = (state, action) => {
  // Напишите ваш reducer здесь
  return state;
};

const StepCounter = () => {
  // Подключите useReducer

  return (
    <div>
      <p>Счётчик: {/* count */}</p>
      <label>
        Шаг: <input type="number" min="1" />
      </label>
      <div>
        <button>-</button>
        <button>+</button>
        <button>Сброс</button>
      </div>
    </div>
  );
};

export default StepCounter;
