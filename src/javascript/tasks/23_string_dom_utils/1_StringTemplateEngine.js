// Простой шаблонизатор строк renderTemplate
// Напишите функцию renderTemplate(template, data), подставляющую значения из объекта data в шаблон {{ key }} или {{ nested.key }}.

const renderTemplate = (template, data) => {
  // Решение тут
};

// Пример вызова:
const template = "Привет, {{ user.name }}! Твой баланс: {{ user.balance }}$";
const data = {
  user: {
    name: "Алексей",
    balance: 100,
  },
};

console.log(renderTemplate(template, data)); // "Привет, Алексей! Твой баланс: 100$"
