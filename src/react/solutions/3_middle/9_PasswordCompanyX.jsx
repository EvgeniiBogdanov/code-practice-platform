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
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <input
        type={isVisible ? 'text' : 'password'}
        value={password}
        onChange={handleInputChange}
        placeholder="Введите пароль"
        style={{
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontSize: '14px',
          outline: 'none',
        }}
      />
      <button
        onClick={toggleVisibility}
        type="button"
        style={{
          padding: '8px 14px',
          borderRadius: '4px',
          border: '1px solid #0070f3',
          background: '#0070f3',
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        {isVisible ? 'Скрыть пароль' : 'Показать пароль'}
      </button>
    </div>
  );
};

export default Password;
