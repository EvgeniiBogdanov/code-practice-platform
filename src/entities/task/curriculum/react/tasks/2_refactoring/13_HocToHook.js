// Проведите рефакторинг: логика размеров окна и статуса сети переиспользуется через HOC.
// Из-за этого дерево обрастает обёртками, пропсы приходят «из ниоткуда»,
// а два HOC конфликтуют: оба передают проп с именем data, и второй затирает первый.
// Замените HOC на кастомные хуки.

import React, { useEffect, useState } from 'react';

function withWindowSize(Component) {
  return function WithWindowSize(props) {
    const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
      const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <Component {...props} data={size} />;
  };
}

function withOnlineStatus(Component) {
  return function WithOnlineStatus(props) {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
      const update = () => setIsOnline(navigator.onLine);
      window.addEventListener('online', update);
      window.addEventListener('offline', update);
      return () => {
        window.removeEventListener('online', update);
        window.removeEventListener('offline', update);
      };
    }, []);

    return <Component {...props} data={isOnline} />;
  };
}

function StatusBar({ data }) {
  // Какой data сюда пришёл — размеры или статус сети?
  return <p>Статус: {String(data)}</p>;
}

export default withOnlineStatus(withWindowSize(StatusBar));
