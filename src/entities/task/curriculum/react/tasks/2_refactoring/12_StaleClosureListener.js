// Проведите рефакторинг ChatInput: по Ctrl+Enter (в любом месте страницы) должно отправляться
// текущее сообщение, но onSend всегда получает пустую строку.
// Если добавить message в зависимости эффекта, слушатель будет переподписываться на каждое нажатие клавиши.
// Исправьте баг так, чтобы слушатель подписывался один раз.

import React, { useEffect, useState } from 'react';

export default function ChatInput({ onSend }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        onSend(message);
        setMessage('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <input
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Сообщение (Ctrl+Enter — отправить)"
    />
  );
}
