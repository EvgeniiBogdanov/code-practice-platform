import React from "react";
import Buttons from "./Buttons";

export default function List({ numbers, addRandomNumber, removeNumber }) {
  const timerRef = React.useRef(null);
  const [started, setStarted] = React.useState(false);

  const start = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(addRandomNumber, 1000);
    setStarted(true);
  };

  const stop = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setStarted(false);
  };

  React.useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="list">
      <Buttons
        started={started}
        addRandomNumber={addRandomNumber}
        onStart={start}
        onStop={stop}
      />
      <ul>
        {numbers.map((item) => (
          <li key={item.id}>
            {item.value}{" "}
            <button onClick={() => removeNumber(item.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
