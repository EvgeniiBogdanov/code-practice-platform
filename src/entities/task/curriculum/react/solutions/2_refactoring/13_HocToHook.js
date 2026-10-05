import React, { useEffect, useState } from 'react';

//  ПРАВИЛЬНО: логика вынесена в хуки — без обёрток и скрытых пропсов
function useWindowSize() {
  const [size, setSize] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));

  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  return isOnline;
}

//  Компонент сам выбирает имена переменных — конфликт пропсов невозможен
export default function StatusBar() {
  const { width, height } = useWindowSize();
  const isOnline = useOnlineStatus();

  return (
    <p>
      Окно: {width}×{height} · Сеть: {isOnline ? 'онлайн' : 'офлайн'}
    </p>
  );
}
