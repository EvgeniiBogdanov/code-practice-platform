const countProps = (obj) => {
  return Object.keys(obj).length;
};

// Пример вызова:
console.log(countProps({ a: 1, b: 2, c: 3 })); // 3
console.log(countProps({ name: "Alice" }));     // 1
console.log(countProps({}));                    // 0
