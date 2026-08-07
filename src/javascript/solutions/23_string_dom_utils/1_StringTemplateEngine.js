/**
 * Решение задачи: Простой шаблонизатор строк renderTemplate
 */
function renderTemplate(template, data) {
  if (typeof template !== 'string') return '';
  if (!data || typeof data !== 'object') return template;

  return template.replace(/{{\s*([\w.]+)\s*}}/g, (match, path) => {
    const keys = path.split('.');
    let value = data;

    for (const key of keys) {
      if (value === null || value === undefined) {
        return '';
      }
      value = value[key];
    }

    return value !== undefined && value !== null ? String(value) : '';
  });
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
