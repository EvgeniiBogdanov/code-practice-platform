const transactions = [
  { amount: 100, category: "Food" },
  { amount: 50, category: "Transport" },
  { amount: 200, category: "Food" },
  { amount: 120, category: "Entertainment" },
];

const sumByCategory = (transactions) => {
  return transactions.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});
};

// Пример вызова:
console.log(sumByCategory(transactions)); // { Food: 300, Transport: 50, Entertainment: 120 }
