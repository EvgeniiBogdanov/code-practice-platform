const countProps = (obj) => {
  let count = 0;

  for (const _ in obj) {
    count++;
  }

  return count;
};

// Пример вызова:
console.log(countProps({ a: 1, b: 2, c: 3 })); // 3
console.log(countProps({ name: "Alice" }));     // 1
console.log(countProps({}));                    // 0
