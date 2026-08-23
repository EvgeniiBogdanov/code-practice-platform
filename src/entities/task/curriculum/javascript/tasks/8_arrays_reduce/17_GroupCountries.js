/*
 * Необходимо сгруппировать данные в объект, отсортировав их по странам
 */

/*
  const result = {
    Russia: {
      1: { age: 24, name: "Иван", country: "Russia" },
      3: { age: 22, name: "Алексей", country: "Russia" },
      5: { age: 20, name: "Антон", country: "Russia" },
    },
    Belarus: {
      2: { age: 23, name: "Дмитрий", country: "Belarus" },
      4: { age: 21, name: "Олег", country: "Belarus" },
    },
  };
*/

const data = [
  { id: 1, age: 24, name: "Иван", country: "Russia" },
  { id: 2, age: 23, name: "Дмитрий", country: "Belarus" },
  { id: 3, age: 22, name: "Алексей", country: "Russia" },
  { id: 4, age: 21, name: "Олег", country: "Belarus" },
  { id: 5, age: 20, name: "Антон", country: "Russia" },
];

const groupCountries = (data) => {
  // Ваш код здесь
};

console.log(groupCountries(data));
