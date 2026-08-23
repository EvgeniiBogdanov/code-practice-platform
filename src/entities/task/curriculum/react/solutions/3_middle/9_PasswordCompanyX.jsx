import { useState, useEffect, useRef } from 'react';

const Password = ({ hideTimeoutMs = 5000 }) => {
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      timerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, hideTimeoutMs);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isVisible, password, hideTimeoutMs]);

  const handleInputChange = (e) => {
    setPassword(e.target.value);
  };

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <div>
      <input
        type={isVisible ? 'text' : 'password'}
        value={password}
        onChange={handleInputChange}
        placeholder="Введите пароль"
      />
      <button onClick={toggleVisibility} type="button">
        {isVisible ? 'Скрыть пароль' : 'Показать пароль'}
      </button>
    </div>
  );
};

export default Password;
