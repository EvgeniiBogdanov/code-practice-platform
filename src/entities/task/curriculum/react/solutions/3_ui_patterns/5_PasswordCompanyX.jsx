import { useState, useEffect } from 'react';

const Password = ({ hideTimeoutMs = 5000 }) => {
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // Таймер авто-скрытия синхронизирован с состоянием «пароль виден».
  // password в зависимостях: каждое изменение текста перезапускает таймер.
  // Cleanup отменяет таймер при скрытии вручную, новом вводе и размонтировании.
  useEffect(() => {
    if (!isVisible) return;

    const timeoutId = setTimeout(() => setIsVisible(false), hideTimeoutMs);
    return () => clearTimeout(timeoutId);
  }, [isVisible, password, hideTimeoutMs]);

  return (
    <div>
      <input
        type={isVisible ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Введите пароль"
        autoComplete="current-password"
      />
      <button type="button" aria-pressed={isVisible} onClick={() => setIsVisible((prev) => !prev)}>
        {isVisible ? 'Скрыть пароль' : 'Показать пароль'}
      </button>
    </div>
  );
};

export default Password;
