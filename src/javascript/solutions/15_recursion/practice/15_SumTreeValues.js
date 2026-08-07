const tree = {
  value: 1,
  children: [
    {
      value: 2,
      children: [{ value: 4 }, { value: 5 }],
    },
    {
      value: 3,
      children: [{ value: 6 }, { value: 7 }],
    },
  ],
};

const sumTree = (data) => {
  let sum = data.value;

  if (data.children) {
    for (const child of data.children) {
      sum += sumTree(child);
    }
  }

  return sum;
};

console.log(sumTree(tree)); // 28
