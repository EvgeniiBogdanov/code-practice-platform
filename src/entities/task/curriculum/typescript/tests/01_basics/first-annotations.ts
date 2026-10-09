test("userName хранит только строки", () => {
  userName = "Bob";
  // @ts-expect-error
  userName = 42;
});

test("userAge хранит только числа", () => {
  userAge = 31;
  // @ts-expect-error
  userAge = "31";
});

test("isActive хранит только логические значения", () => {
  isActive = false;
  // @ts-expect-error
  isActive = "yes";
});

test("scores — массив чисел", () => {
  scores.push(40);
  // @ts-expect-error
  scores.push("40");
});
