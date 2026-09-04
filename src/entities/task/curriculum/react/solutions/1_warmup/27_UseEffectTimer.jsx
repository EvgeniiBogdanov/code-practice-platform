import { useState, useEffect } from "react";

const Timer = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Запускаем интервал каждую секунду
    const intervalId = setInterval(() => {
      // Функциональный сеттер гарантирует актуальное состояние без добавления seconds в deps
      setSeconds((prev) => prev + 1);
    }, 1000);

    // Обязательная очистка таймера при размонтировании
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleReset = () => {
    setSeconds(0);
  };

  return (
    <div>
      <p>Прошло секунд: {seconds}</p>
      <button onClick={handleReset}>Сбросить</button>
    </div>
  );
};

export default Timer;
