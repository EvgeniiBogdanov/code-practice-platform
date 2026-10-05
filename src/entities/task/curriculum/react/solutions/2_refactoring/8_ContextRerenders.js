import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

//  ПРАВИЛЬНО: данные, которые меняются с разной частотой, живут в разных контекстах
const ThemeContext = createContext(null);
const NotificationsContext = createContext(0);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const toggleTheme = useCallback(() => setTheme((t) => (t === 'light' ? 'dark' : 'light')), []);

  //  ПРАВИЛЬНО: value меняет ссылку только при смене темы
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setNotifications((n) => n + 1), 2000);
    return () => clearInterval(id);
  }, []);

  return <NotificationsContext value={notifications}>{children}</NotificationsContext>;
}

function ThemeButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  console.log('Рендер ThemeButton');
  return <button onClick={toggleTheme}>Тема: {theme}</button>;
}

function NotificationBell() {
  const notifications = useContext(NotificationsContext);
  console.log('Рендер NotificationBell');
  return <span>🔔 {notifications}</span>;
}

//  ThemeButton и NotificationBell созданы здесь и приходят в провайдеры через children,
// поэтому ререндер NotificationsProvider не перерисовывает ThemeButton
export default function App() {
  return (
    <ThemeProvider>
      <NotificationsProvider>
        <ThemeButton />
        <NotificationBell />
      </NotificationsProvider>
    </ThemeProvider>
  );
}
