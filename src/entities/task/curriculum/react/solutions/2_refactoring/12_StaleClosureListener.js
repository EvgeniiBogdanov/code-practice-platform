import React, { useEffect, useEffectEvent, useState } from 'react';

export default function ChatInput({ onSend }) {
  const [message, setMessage] = useState('');

  //  ПРАВИЛЬНО (React 19.2+): Effect Event всегда видит свежие message и onSend,
  // но не является реактивной зависимостью — эффект не перезапускается при вводе
  const sendMessage = useEffectEvent(() => {
    onSend(message);
    setMessage('');
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        sendMessage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); //  Подписка один раз: Effect Event не нужно указывать в зависимостях

  return (
    <input
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Сообщение (Ctrl+Enter — отправить)"
    />
  );
}

// Вариант для React < 19.2 — паттерн «latest ref»:
//
// const latest = useRef({ message, onSend });
// useLayoutEffect(() => { latest.current = { message, onSend }; });
// ...внутри handleKeyDown: latest.current.onSend(latest.current.message);
