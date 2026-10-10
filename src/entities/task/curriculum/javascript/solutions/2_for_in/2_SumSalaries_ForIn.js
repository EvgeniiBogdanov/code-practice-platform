const sumSalaries = (salaries) => {
  let sum = 0;

  for (const key in salaries) {
    sum += salaries[key];
  }

  return sum;
};

// Пример вызова:
const salaries = {
  Olga: 1200,
  Timur: 950,
  Lena: 1450,
};

console.log(sumSalaries(salaries)); // 3600
console.log(sumSalaries({}));         // 0
