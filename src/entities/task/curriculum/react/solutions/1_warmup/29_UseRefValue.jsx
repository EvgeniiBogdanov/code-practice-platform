import { useState, useRef, useEffect } from "react";

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);

  const handleStart = () => {
    // Не запускаем повторный интервал, если таймер уже работает
    if (timerRef.current !== null) return;

    timerRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  };

  const handleStop = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleReset = () => {
    handleStop();
    setTime(0);
  };

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div>
      <p>Время: {time} с</p>
      <button onClick={handleStart}>Старт</button>
      <button onClick={handleStop}>Стоп</button>
      <button onClick={handleReset}>Сброс</button>
    </div>
  );
};

export default Stopwatch;
