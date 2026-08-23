const users = [
  { name: "Аня", city: "Москва" },
  { name: "Петя", city: "Питер" },
  { name: "Оля", city: "Москва" },
];

const groupBy = (items, key) => {
  return items.reduce((acc, item) => {
    const groupKey = item[key];
    acc[groupKey] = acc[groupKey] || [];
    acc[groupKey].push(item);
    return acc;
  }, {});
};

// Пример вызова:
console.log(groupBy(users, "city"));
