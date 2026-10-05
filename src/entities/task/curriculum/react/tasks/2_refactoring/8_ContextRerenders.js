// Проведите рефакторинг: каждые 2 секунды приходит новое уведомление,
// и из-за этого перерисовываются ВСЕ потребители контекста — даже ThemeButton,
// которому уведомления не нужны (смотрите console.log). Устраните лишние ререндеры.

import React, { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext(null);

function AppProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setNotifications((n) => n + 1), 2000);
    return () => clearInterval(id);
  }, []);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <AppContext.Provider value={{ theme, toggleTheme, notifications }}>
      {children}
    </AppContext.Provider>
  );
}

function ThemeButton() {
  const { theme, toggleTheme } = useContext(AppContext);
  console.log('Рендер ThemeButton');
  return <button onClick={toggleTheme}>Тема: {theme}</button>;
}

function NotificationBell() {
  const { notifications } = useContext(AppContext);
  console.log('Рендер NotificationBell');
  return <span>🔔 {notifications}</span>;
}

export default function App() {
  return (
    <AppProvider>
      <ThemeButton />
      <NotificationBell />
    </AppProvider>
  );
}
