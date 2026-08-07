const fruits = ["banana", "apple", "cherry"];

const sortAlphabeticallyLocale = (arr) =>
  arr.sort((a, b) => a.localeCompare(b));

console.log(sortAlphabeticallyLocale(fruits)); // ["apple", "banana", "cherry"]
