// Методы трансформации объектов (Object.keys, values, entries, fromEntries)
// Напишите функцию transformPrices(prices, multiplier, minPrice = 0), которая:
// 1. Принимает объект prices со стоимостью товаров, числовой множитель multiplier и минимальную цену minPrice (дефолт 0).
// 2. Отфильтровывает нечисловые значения цен (и NaN).
// 3. Умножает каждую цену на multiplier и округляет до ближайшего целого (Math.round).
// 4. Оставляет только те товары, чья новая цена >= minPrice.
// 5. Возвращает новый объект через Object.fromEntries, не мутируя исходный.

const transformPrices = (prices, multiplier, minPrice = 0) => {
  // Решение тут
};

// Пример вызова:
const inventory = {
  apple: 100,
  banana: 40,
  orange: 150,
  milk: "not_a_number",
  water: 25,
};

console.log(transformPrices(inventory, 1.2, 50));
// { apple: 120, orange: 180 }

console.log(transformPrices({ cpu: 300, gpu: 800, ram: 100 }, 0.5, 100));
// { cpu: 150, gpu: 400 }
