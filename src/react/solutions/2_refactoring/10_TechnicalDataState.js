import React, { useState, useRef } from 'react';

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  
  //  ПРАВИЛЬНО: Храним ID таймера в useRef
  const timerRef = useRef(null);

  const startRecording = () => {
    setIsRecording(true);
    // Мутируем current напрямую, без рендеров
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

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
