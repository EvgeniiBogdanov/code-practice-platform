import { createContext, useContext, useState } from "react";

export const ThemeContext = createContext(null);

// Хук-обёртка: одна точка доступа и понятная ошибка вне провайдера
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme должен вызываться внутри ThemeContext.Provider");
  return context;
};

const ThemeToggle = () => {
  const { toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Переключить тему</button>;
};

const Header = () => {
  const { theme } = useTheme();
  return <h3>Текущая тема: {theme}</h3>;
};

// Layout ничего не знает о теме — данные идут мимо него через контекст
const Layout = () => (
  <div>
    <Header />
    <ThemeToggle />
  </div>
);

const App = () => {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // React 19: <ThemeContext> можно использовать как провайдер напрямую
  return (
    <ThemeContext value={{ theme, toggleTheme }}>
      <Layout />
    </ThemeContext>
  );
};

export default App;
