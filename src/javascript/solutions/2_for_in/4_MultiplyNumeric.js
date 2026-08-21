const multiplyNumeric = (obj) => {
  for (const key in obj) {
    if (typeof obj[key] === "number") {
      obj[key] *= 2;
    }
  }

  return obj;
};

// Пример вызова:
const menu = {
  width: 200,
  height: 300,
  title: "My menu",
  isDefault: true,
};

console.log(multiplyNumeric(menu));
// { width: 400, height: 600, title: "My menu", isDefault: true }
