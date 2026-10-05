import React, { useEffect, useRef, useState } from 'react';

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  //  ПРАВИЛЬНО: id интервала не влияет на разметку — храним его в ref, а не в state
  const timerRef = useRef(null);

  const startRecording = () => {
    if (timerRef.current !== null) return; // защита от второго интервала
    setIsRecording(true);
    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  //  ПРАВИЛЬНО: интервал не переживает компонент
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div>
      <p>Запись: {seconds} сек.</p>
      {isRecording ? (
        <button onClick={stopRecording}>Остановить</button>
      ) : (
        <button onClick={startRecording}>Начать запись</button>
      )}
    </div>
  );
}
