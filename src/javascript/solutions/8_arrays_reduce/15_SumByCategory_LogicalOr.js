const transactions = [
  { category: 'food', amount: 150 },
  { category: 'transport', amount: 50 },
  { category: 'food', amount: 300 },
  { category: 'entertainment', amount: 200 },
  { category: 'transport', amount: 70 }
];

const sumByCategory = (arr) => {
  return arr.reduce((acc, { category, amount }) => {
    acc[category] = (acc[category] || 0) + amount;

    return acc;
  }, {});
};

console.log(sumByCategory(transactions)); // { food: 450, transport: 120, entertainment: 200 }
