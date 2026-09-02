// Глубокая деструктуризация с fallback значениями
// Напишите функцию getThemeColor(config), безопасно извлекающую primary color из config.theme.colors.primary (по умолчанию '#000').

const getThemeColor = (config) => {
  // Решение тут
};

// Пример вызова:
console.log(getThemeColor({ theme: { colors: { primary: "#ff0000" } } })); // "#ff0000"
console.log(getThemeColor({})); // "#000"
