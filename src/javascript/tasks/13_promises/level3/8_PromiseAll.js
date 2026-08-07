// Загрузите ВСЕ товары параллельно с помощью Promise.all
// и выведите их суммарную стоимость.

const fetchPrice = (item) =>
  new Promise((resolve) => setTimeout(() => resolve(item.price), 200));

const items = [{ price: 100 }, { price: 250 }, { price: 90 }];

async function totalParallel() {
  // Ваш код здесь
}
