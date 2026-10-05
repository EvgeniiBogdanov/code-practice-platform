// Проведите рефакторинг компонента AudioRecorder: избавьтесь от лишних рендеров, вызванных хранением технических данных в состоянии.

import React, { useState } from 'react';

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  
  const [timerId, setTimerId] = useState(null);

  const startRecording = () => {
    setIsRecording(true);
    const id = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    setTimerId(id); 
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(timerId);
    setTimerId(null); 
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