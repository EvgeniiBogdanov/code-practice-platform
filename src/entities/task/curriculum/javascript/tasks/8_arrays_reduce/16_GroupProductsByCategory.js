// Группировка названий товаров по категориям
// Напишите функцию groupProductsByCategory(products), которая возвращает объект, где ключи — категории, а значения — массивы названий товаров.

const products = [
  { name: "Яблоко", category: "Фрукты" },
  { name: "Морковь", category: "Овощи" },
  { name: "Банан", category: "Фрукты" },
  { name: "Огурец", category: "Овощи" },
  { name: "Груша", category: "Фрукты" },
];

const groupProductsByCategory = (products) => {
  // Решение тут
};

// Пример вызова:
console.log(groupProductsByCategory(products));
// {
//   "Фрукты": ["Яблоко", "Банан", "Груша"],
//   "Овощи": ["Морковь", "Огурец"]
// }
