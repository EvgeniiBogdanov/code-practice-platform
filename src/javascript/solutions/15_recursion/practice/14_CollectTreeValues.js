const tree = {
  value: 0,
  children: [
    {
      value: 1,
      children: [{ value: 2 }],
    },
    {
      value: 3,
      children: [{ value: 4 }, { value: 5 }],
    },
  ],
};

const recursionTree = (data) => {
  const arr = [data.value];

  if (data.children) {
    for (const el of data.children) {
      arr.push(...recursionTree(el));
    }
  }
  return arr;
};

console.log(recursionTree(tree)); // [0, 1, 2, 3, 4, 5]
