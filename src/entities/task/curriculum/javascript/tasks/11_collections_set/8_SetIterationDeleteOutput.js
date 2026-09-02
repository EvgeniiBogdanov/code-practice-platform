// Что выведет данный код в консоль и почему?

const set = new Set([1, 2, 3, 4]);

set.forEach((value) => {
  if (value === 2) {
    set.delete(2);
    set.add(5);
  }
  console.log(value);
});
