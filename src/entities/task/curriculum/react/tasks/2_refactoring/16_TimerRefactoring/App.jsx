import { useEffect, useRef, useState } from "react";
import "./App.css";

// Компонент таймера, который требует рефакторинга

const App = () => {
  const [started, setStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const intervalId = useRef();

  const stopHandler = () => {
    setCurrentTime(0);
    setStarted(false);
    clearInterval(intervalId.current);
    intervalId.current = null;
  };

  const startHandler = () => {
    if (started) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    } else {
      intervalId.current = setInterval(() => {
        setCurrentTime((prev) => prev + 1);
      }, 1000);
    }
    setStarted(!started);
  };

  useEffect(() => {
    if (currentTime % 5 === 0 && currentTime !== 0) {
      document.querySelector(".timer").classList.add("pulsate");
    }
  }, [currentTime]);

  return (
    <main className="main">
      <div className="timer-controls">
        <button onClick={startHandler}>{started ? "Pause" : "Start"}</button>
        <button onClick={stopHandler}>Stop</button>
      </div>
      <div className="timer">{">>>"} : {currentTime}</div>
    </main>
  );
};

export default App;
