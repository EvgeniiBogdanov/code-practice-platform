// Объединить массив транзакций в один объект, суммируя amount по категориям
// Вывод: { food: 450, transport: 120, entertainment: 200 }

const transactions = [
  { category: 'food', amount: 150 },
  { category: 'transport', amount: 50 },
  { category: 'food', amount: 300 },
  { category: 'entertainment', amount: 200 },
  { category: 'transport', amount: 70 }
];

// Тут код:
const sumByCategory = () => {};

// Проверка
const result = sumByCategory(transactions);
console.log(result);
