const transformPrices = (prices, multiplier, minPrice = 0) => {
  if (!prices || typeof prices !== "object") {
    return {};
  }

  const transformedEntries = Object.entries(prices)
    .filter(([, price]) => typeof price === "number" && !Number.isNaN(price))
    .map(([item, price]) => [item, Math.round(price * multiplier)])
    .filter(([, newPrice]) => newPrice >= minPrice);

  return Object.fromEntries(transformedEntries);
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
