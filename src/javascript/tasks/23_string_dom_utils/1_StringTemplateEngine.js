/**
 * Напишите функцию renderTemplate(template, data), которая выполняет
 * подстановку значений из объекта data в строку-шаблон template.
 *
 * Подгруппа: Шаблонизация
 *
 * Требования:
 * - Шаблон содержит плейсхолдеры вида {{ key }} или {{ nested.key }}
 * - Функция должна поддерживать вложенные свойства через точку (например, user.name)
 * - Игнорировать пробелы внутри плейсхолдера (например, {{ name }} и {{name}} работают одинаково)
 * - Если ключ не найден в data (undefined или null), заменять плейсхолдер на пустую строку ''
 * - Если значение в data — 0, false или '', оно должно корректно подставляться
 *
 * @param {string} template - Строка с шаблоном
 * @param {Object} data - Объект с данными для подстановки
 * @returns {string} - Итоговая строка
 */
function renderTemplate(template, data) {
  // Ваш код здесь
}

// Примеры использования:
const template1 = 'Привет, {{ user.name }}! Твой баланс: {{ user.balance }}$';
const data1 = {
  user: {
    name: 'Алексей',
    balance: 100,
  },
};
console.log(renderTemplate(template1, data1));
// Вывод: 'Привет, Алексей! Твой баланс: 100$'

const template2 = 'Item: {{ item.title }}, Count: {{ count }}, Discount: {{ discount }}';
const data2 = {
  item: { title: 'Laptop' },
  count: 0,
};
console.log(renderTemplate(template2, data2));
// Вывод: 'Item: Laptop, Count: 0, Discount: '
