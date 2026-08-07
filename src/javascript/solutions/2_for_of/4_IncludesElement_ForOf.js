// Вариант 1: Через цикл for...of
const fruits = ["яблоко", "банан", "апельсин", "груша"];

const getFindElement = (arr, element) => {
  for (const item of arr) {
    if (item === element) return true;
  }

  return false;
};

console.log(getFindElement(fruits, "банан"));
