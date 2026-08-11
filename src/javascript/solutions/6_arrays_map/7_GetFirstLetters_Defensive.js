const words = ["JavaScript", "React", "Vue", "Next"];

const getFirstLettersDefensive = (arr) =>
  arr.map((word) => word?.charAt(0) || "");

// Пример вызова:
console.log(getFirstLettersDefensive(words)); // ["J", "R", "V", "N"]
