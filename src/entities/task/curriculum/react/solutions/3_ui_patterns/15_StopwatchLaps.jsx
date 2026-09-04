import React, { useState, useRef, useEffect } from 'react';

const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const hundredths = Math.floor((milliseconds % 1000) / 10);

  const pad = (value) => String(value).padStart(2, '0');

  return `${pad(minutes)}:${pad(seconds)}.${pad(hundredths)}`;
};

export default function Stopwatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [laps, setLaps] = useState([]);

  const startTimeRef = useRef(0);
  const accumulatedTimeRef = useRef(0);
  const intervalIdRef = useRef(null);

  // Очистка интервала при размонтировании компонента для предотвращения утечки памяти
  useEffect(() => {
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  const handleStart = () => {
    if (isRunning) return;

    setIsRunning(true);
    startTimeRef.current = Date.now();

    intervalIdRef.current = setInterval(() => {
      // Расчет по разнице меток времени компенсирует дрейф Event Loop
      setElapsedTime(Date.now() - startTimeRef.current + accumulatedTimeRef.current);
    }, 16);
  };

  const handlePause = () => {
    if (!isRunning) return;

    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    accumulatedTimeRef.current += Date.now() - startTimeRef.current;
    setElapsedTime(accumulatedTimeRef.current);
    setIsRunning(false);
  };

  const handleReset = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    startTimeRef.current = 0;
    accumulatedTimeRef.current = 0;
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (!isRunning) return;

    const currentTotal = elapsedTime;
    const prevTotal = laps.length > 0 ? laps[0].totalTime : 0;
    const splitTime = currentTotal - prevTotal;

    const newLap = {
      id: laps.length + 1,
      totalTime: currentTotal,
      splitTime,
    };

    setLaps((prev) => [newLap, ...prev]);
  };

  return (
    <div>
      <h2>Спортивный секундомер</h2>

      <div>
        <p>
          <strong>
            <code>{formatTime(elapsedTime)}</code>
          </strong>
        </p>
      </div>

      <div>
        {!isRunning ? (
          <button type="button" onClick={handleStart}>
            Старт
          </button>
        ) : (
          <button type="button" onClick={handlePause}>
            Пауза
          </button>
        )}

        <button type="button" onClick={handleLap} disabled={!isRunning}>
          Круг (Lap)
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={elapsedTime === 0 && laps.length === 0}
        >
          Сброс
        </button>
      </div>

      {laps.length > 0 && (
        <div>
          <h3>Зафиксированные круги</h3>
          <table>
            <thead>
              <tr>
                <th>№ Круга</th>
                <th>Время круга</th>
                <th>Общее время</th>
              </tr>
            </thead>
            <tbody>
              {laps.map((lap) => (
                <tr key={lap.id}>
                  <td>Круг {lap.id}</td>
                  <td>+{formatTime(lap.splitTime)}</td>
                  <td>{formatTime(lap.totalTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
