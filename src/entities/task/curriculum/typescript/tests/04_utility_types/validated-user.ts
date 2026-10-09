describe("validateUser", () => {
  test("принимает имя и возраст", () => {
    validateUser("Alice", 30);
    // @ts-expect-error
    validateUser(30, "Alice");
  });

  test("user доступен только после проверки успеха", () => {
    const result = validateUser("Alice", 30);
    if (result.ok) {
      const name: string = result.user.name;
      const age: number = result.user.age;
      // @ts-expect-error
      result.errors;
    }
  });

  test("errors доступны только после проверки неудачи", () => {
    const result = validateUser("", 10);
    if (!result.ok) {
      const nameError: string | undefined = result.errors.name;
      const ageError: string | undefined = result.errors.age;
      // @ts-expect-error
      result.user;
      // @ts-expect-error
      result.errors.email;
    }
  });
});
