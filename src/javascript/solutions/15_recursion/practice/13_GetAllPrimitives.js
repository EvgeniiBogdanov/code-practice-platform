const obj = {
  a: {
    l: { u: 8 },
    b: 1,
  },
  c: {
    d: 2,
    e: { f: 7 },
    g: {
      m: {
        p: {
          o: 10,
        },
      },
    },
  },
  j: 4,
};

const getAllPrimitives = (obj) => {
  const arr = [];

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === "number") {
      arr.push(value);
    } else if (typeof value === "object" && value !== null) {
      arr.push(...getAllPrimitives(value));
    }
  }
  return arr;
};

console.log(getAllPrimitives(obj)); // [8, 1, 2, 7, 10, 4]
