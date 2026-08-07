const data = [
  { id: 1, age: 24, name: "Иван", country: "Russia" },
  { id: 2, age: 23, name: "Дмитрий", country: "Belarus" },
  { id: 3, age: 22, name: "Алексей", country: "Russia" },
  { id: 4, age: 21, name: "Олег", country: "Belarus" },
  { id: 5, age: 20, name: "Антон", country: "Russia" },
];

const groupCountries = (data) => {
  return data.reduce((acc, { id, age, name, country }) => {
    acc[country] ??= {};
    acc[country][id] = { age, name, country };

    return acc;
  }, {});
};

console.log(groupCountries(data));
