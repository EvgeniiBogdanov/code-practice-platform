import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

const TICK_INTERVAL_MS = 1000;
const PULSATE_EVERY_N_SECONDS = 5;
const PULSATE_DURATION_MS = 600;

/**
 * Инкапсулирует всю логику секундомера: старт/пауза/стоп и тик по интервалу.
 * Компонент остаётся ответственным только за отображение.
 */
const useTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef(null);

  const clearTick = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const start = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, TICK_INTERVAL_MS);
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    clearTick();
    setIsRunning(false);
  }, []);

  const toggle = useCallback(() => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  }, [isRunning, pause, start]);

  const stop = useCallback(() => {
    clearTick();
    setIsRunning(false);
    setElapsedSeconds(0);
  }, []);

  // Гарантированно чистим интервал при размонтировании компонента.
  useEffect(() => clearTick, []);

  return { isRunning, elapsedSeconds, toggle, stop };
};

const formatTime = (totalSeconds) => {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const App = () => {
  const { isRunning, elapsedSeconds, toggle, stop } = useTimer();
  const [isPulsating, setIsPulsating] = useState(false);

  // Каждые PULSATE_EVERY_N_SECONDS секунд кратковременно включаем пульсацию
  // через состояние — без прямого обращения к DOM, и она сама выключается.
  useEffect(() => {
    const shouldPulsate =
      elapsedSeconds !== 0 && elapsedSeconds % PULSATE_EVERY_N_SECONDS === 0;

    if (!shouldPulsate) return;

    setIsPulsating(true);
    const timeoutId = setTimeout(() => {
      setIsPulsating(false);
    }, PULSATE_DURATION_MS);

    return () => clearTimeout(timeoutId);
  }, [elapsedSeconds]);

  return (
    <main className="main">
      <div className="timer-controls">
        <button onClick={toggle}>{isRunning ? "Pause" : "Start"}</button>
        <button onClick={stop}>Stop</button>
      </div>
      <div className={`timer${isPulsating ? " pulsate" : ""}`}>
        {formatTime(elapsedSeconds)}
      </div>
    </main>
  );
};

export default App;
