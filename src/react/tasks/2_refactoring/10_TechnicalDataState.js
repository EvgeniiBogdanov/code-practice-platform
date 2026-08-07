/* Что проверяет: Понимание того, когда данные должны лежать в useState (и обновлять интерфейс), 
а когда в useRef (и просто храниться "под капотом"). */

/* В чем подвох: Разработчик пишет компонент для записи голосовых сообщений с таймером. 
Он сохраняет ID интервала в useState. Но изменение ID интервала никак не влияет на то, что видит пользователь, 
зато вызывает абсолютно лишний рендер компонента.
*/

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
