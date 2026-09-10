// Загрузите данные всех товаров параллельно с помощью Promise.all и посчитайте их суммарную стоимость.
// Функция totalParallel() должна вернуть итоговую сумму цен товаров.

const fetchPrice = (item) =>
  new Promise((resolve) => setTimeout(() => resolve(item.price), 200));

const items = [{ price: 100 }, { price: 250 }, { price: 90 }];

async function totalParallel() {
  // Решение тут
}

// Пример вызова:
totalParallel().then(console.log); // 440
