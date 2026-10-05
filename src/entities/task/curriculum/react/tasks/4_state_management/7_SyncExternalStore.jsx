import React, { useEffect, useState } from 'react';

/**
 * Задача: useSyncExternalStore
 *
 * Компоненты подписываются на внешние источники данных через useState + useEffect.
 * В конкурентном рендере такой подход может показать «разорванный» UI (tearing):
 * разные компоненты успевают прочитать разные версии внешних данных.
 *
 * Требования:
 * 1. Перепишите useOnlineStatus на useSyncExternalStore (subscribe + getSnapshot).
 * 2. Напишите минимальный внешний стор createCounterStore() с методами
 *    getState(), increment(), subscribe(listener) → unsubscribe.
 * 3. Хук useCounter(store) читает значение стора через useSyncExternalStore.
 *    Два компонента CounterView показывают одно и то же значение.
 * 4. Ответьте в комментарии: почему getSnapshot не может каждый раз возвращать новый объект
 *    (например, () => ({ count: store.getState() }))?
 */

const useOnlineStatus = () => {
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

  return isOnline;
};

const createCounterStore = () => {
  // Напишите внешний стор здесь
};

const CounterView = ({ label }) => <p>{label}: {/* значение счётчика */}</p>;

const App = () => {
  const isOnline = useOnlineStatus();

  return (
    <div>
      <p>Сеть: {isOnline ? 'онлайн' : 'офлайн'}</p>
      <CounterView label="Первый" />
      <CounterView label="Второй" />
      <button>+1</button>
    </div>
  );
};

export default App;
