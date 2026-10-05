import { createContext, useState } from "react";

// **Передайте тему оформления через Context без prop drilling**

// **Требования:**
// 1. Создайте ThemeContext через createContext.
// 2. App хранит тему ("light" | "dark") и передаёт в провайдер значение { theme, toggleTheme }.
// 3. Header и ThemeToggle получают тему через useContext, а не через пропсы.
//    Промежуточный Layout не должен знать о теме.
// 4. ThemeToggle переключает тему, Header показывает текущую.

export const ThemeContext = createContext(null);

const ThemeToggle = () => {
  return <button>Переключить тему</button>;
};

const Header = () => {
  return <h3>Текущая тема: {/* theme */}</h3>;
};

const Layout = () => (
  <div>
    <Header />
    <ThemeToggle />
  </div>
);

const App = () => {
  const [theme, setTheme] = useState("light");

  return <Layout />;
};

export default App;
