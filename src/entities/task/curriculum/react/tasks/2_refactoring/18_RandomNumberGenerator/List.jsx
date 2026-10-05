import React from "react";
import Buttons from "./Buttons";

export default function List() {
  const [numbers, setNumbers] = React.useState([1, 2, 3]);
  let timer = null;
  let started = false;

  const addRandomNumber = () => {
    const random = Math.round(Math.random() * 10);
    setNumbers((prev) => [...prev, random]);
  };

  const start = () => {
    timer = setInterval(addRandomNumber, 1000);
    started = true;
  };

  const stop = () => {
    clearInterval(timer);
    started = false;
  };

  return (
    <div className="list">
      <Buttons
        started={started}
        addRandomNumber={() => addRandomNumber()}
        onStart={() => start()}
        onStop={() => stop()}
      />
      <ul>
        {numbers.map((num, index) => (
          <li key={`${index}_${num}`}>{num}</li>
        ))}
      </ul>
    </div>
  );
}
