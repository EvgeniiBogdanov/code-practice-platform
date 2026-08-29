import React from "react";

export default function Buttons({ addRandomNumber, onStart, onStop, started }) {
  return (
    <div className="buttons">
      <button onClick={addRandomNumber}>Новое число</button>
      <br />
      <button disabled={started} onClick={onStart}>
        Старт
      </button>
      <button onClick={onStop}>Стоп</button>
    </div>
  );
}
