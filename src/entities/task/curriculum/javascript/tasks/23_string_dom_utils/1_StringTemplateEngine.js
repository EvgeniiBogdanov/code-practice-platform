// Шаблонизатор строковых переменных (Template Engine)
// Реализуйте функцию renderTemplate(template, data) для замены подстановок {{ path.to.prop }} на значения из объекта data.
// Поддержите доступ к вложенным свойствам через точку (например, user.name, user.balance).

const renderTemplate = (template, data) => {
  // Решение тут
};

const template = "Привет, {{ user.name }}! Твой баланс: {{ user.balance }}$";
const data = {
  user: {
    name: "Алексей",
    balance: 100,
  },
};

// Пример вызова:
console.log(renderTemplate(template, data)); // "Привет, Алексей! Твой баланс: 100$"
