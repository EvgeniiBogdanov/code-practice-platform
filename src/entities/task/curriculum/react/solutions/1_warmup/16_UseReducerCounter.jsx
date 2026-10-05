import { useReducer } from "react";

const initialState = { count: 0, step: 1 };

// Чистая функция: новое состояние зависит только от state и action
const reducer = (state, action) => {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + state.step };
    case "decrement":
      return { ...state, count: state.count - state.step };
    case "setStep":
      return { ...state, step: action.payload };
    case "reset":
      return initialState;
    default:
      throw new Error(`Неизвестное действие: ${action.type}`);
  }
};

const StepCounter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Счётчик: {state.count}</p>
      <label>
        Шаг:{" "}
        <input
          type="number"
          min="1"
          value={state.step}
          onChange={(e) => dispatch({ type: "setStep", payload: Math.max(1, Number(e.target.value)) })}
        />
      </label>
      <div>
        <button onClick={() => dispatch({ type: "decrement" })}>-</button>
        <button onClick={() => dispatch({ type: "increment" })}>+</button>
        <button onClick={() => dispatch({ type: "reset" })}>Сброс</button>
      </div>
    </div>
  );
};

export default StepCounter;
