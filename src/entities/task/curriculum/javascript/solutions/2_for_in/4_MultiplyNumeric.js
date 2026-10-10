const multiplyNumeric = (obj) => {
  for (const key in obj) {
    if (typeof obj[key] === "number") {
      obj[key] *= 2;
    }
  }

  return obj;
};

// Пример вызова:
const card = {
  price: 150,
  stock: 12,
  name: "Notebook",
  inStock: true,
};

console.log(multiplyNumeric(card));
// { price: 300, stock: 24, name: "Notebook", inStock: true }
