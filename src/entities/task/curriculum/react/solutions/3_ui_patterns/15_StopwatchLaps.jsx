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

  // Технические значения — в ref: они не рисуются напрямую и не должны вызывать рендер
  const startTimeRef = useRef(0); // момент последнего старта (performance.now)
  const accumulatedTimeRef = useRef(0); // время, набранное до последней паузы
  const frameIdRef = useRef(null);

  // Точное текущее время считается по меткам, а не суммированием тиков:
  // таймеры и кадры не гарантируют точность, разница меток — гарантирует
  const getCurrentTime = () => accumulatedTimeRef.current + performance.now() - startTimeRef.current;

  const stopLoop = () => {
    if (frameIdRef.current !== null) cancelAnimationFrame(frameIdRef.current);
    frameIdRef.current = null;
  };

  // Цикл отрисовки синхронизирован с частотой экрана и сам замирает в фоновой вкладке
  const tick = () => {
    setElapsedTime(getCurrentTime());
    frameIdRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => stopLoop, []);

  const handleStart = () => {
    if (isRunning) return;
    startTimeRef.current = performance.now();
    setIsRunning(true);
    frameIdRef.current = requestAnimationFrame(tick);
  };

  const handlePause = () => {
    if (!isRunning) return;
    stopLoop();
    accumulatedTimeRef.current = getCurrentTime();
    setElapsedTime(accumulatedTimeRef.current);
    setIsRunning(false);
  };

  const handleReset = () => {
    stopLoop();
    accumulatedTimeRef.current = 0;
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (!isRunning) return;
    // Время круга — точная метка в момент нажатия, а не значение из последнего кадра
    const totalTime = getCurrentTime();

    setLaps((prev) => {
      const prevTotal = prev.length > 0 ? prev[0].totalTime : 0;
      return [{ id: prev.length + 1, totalTime, splitTime: totalTime - prevTotal }, ...prev];
    });
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
