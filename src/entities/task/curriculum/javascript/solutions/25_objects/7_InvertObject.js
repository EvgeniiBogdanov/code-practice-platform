const invert = (obj) => {
  if (!obj || typeof obj !== "object") {
    return {};
  }

  const result = {};
  for (const key of Object.keys(obj)) {
    const val = String(obj[key]);
    result[val] = key;
  }

  return result;
};

// Пример вызова:
console.log(invert({ a: "1", b: "2", c: "3" }));
// { '1': 'a', '2': 'b', '3': 'c' }

console.log(invert({ apple: "fruit", carrot: "vegetable", banana: "fruit" }));
// { fruit: 'banana', vegetable: 'carrot' }

console.log(invert({ x: 10, y: 20 }));
// { '10': 'x', '20': 'y' }
