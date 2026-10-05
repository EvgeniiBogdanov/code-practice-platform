import React, { useSyncExternalStore } from 'react';

// subscribe объявлен вне компонента: стабильная ссылка, React не переподписывается на каждом рендере
const subscribeOnline = (callback) => {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
};

const useOnlineStatus = () =>
  useSyncExternalStore(
    subscribeOnline,
    () => navigator.onLine, // getSnapshot на клиенте
    () => true // getServerSnapshot для SSR
  );

const createCounterStore = () => {
  let count = 0;
  const listeners = new Set();

  return {
    getState: () => count,
    increment: () => {
      count += 1;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};

const counterStore = createCounterStore();

const useCounter = (store) => useSyncExternalStore(store.subscribe, store.getState);

const CounterView = ({ label }) => {
  const count = useCounter(counterStore);
  return (
    <p>
      {label}: {count}
    </p>
  );
};

const App = () => {
  const isOnline = useOnlineStatus();

  return (
    <div>
      <p>Сеть: {isOnline ? 'онлайн' : 'офлайн'}</p>
      <CounterView label="Первый" />
      <CounterView label="Второй" />
      <button onClick={counterStore.increment}>+1</button>
    </div>
  );
};

export default App;

// Почему getSnapshot не может возвращать новый объект каждый раз?
// React сравнивает снимки через Object.is. Новый объект на каждый вызов означает «данные изменились»,
// React перерисовывает компонент, снова вызывает getSnapshot, снова получает новый объект —
// бесконечный цикл (React выдаст ошибку «The result of getSnapshot should be cached»).
// getSnapshot должен возвращать примитив или ту же ссылку, пока данные не изменились.
