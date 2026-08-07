const fetchPrice = (item) =>
  new Promise((resolve) => setTimeout(() => resolve(item.price), 200));

const items = [{ price: 100 }, { price: 250 }, { price: 90 }];

async function totalParallel() {
  const prices = await Promise.all(items.map(fetchPrice));
  return prices.reduce((sum, p) => sum + p, 0);
}

totalParallel().then(console.log); // 440
