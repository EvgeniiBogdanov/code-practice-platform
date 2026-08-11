const data = [
  { country: "Russia", continent: "Eurasia" },
  { country: "China", continent: "Eurasia" },
  { country: "Canada", continent: "North America" },
  { country: "Egypt", continent: "Africa" },
];

const groupCountries = (data) => {
  return data.reduce((acc, item) => {
    acc[item.continent] ??= [];
    acc[item.continent].push(item.country);
    return acc;
  }, {});
};

// Пример вызова:
console.log(groupCountries(data));
// {
//   Eurasia: ["Russia", "China"],
//   "North America": ["Canada"],
//   Africa: ["Egypt"]
// }
