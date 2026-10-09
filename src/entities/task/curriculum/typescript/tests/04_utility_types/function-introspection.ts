test("LogReturnType — тип результата log", () => {
  type _ = Expect<Equal<LogReturnType, boolean>>;
});

test("LogSecondParam — тип второго параметра log", () => {
  type _ = Expect<Equal<LogSecondParam, number>>;
});
