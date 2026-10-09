describe("findById", () => {
  test("возвращает элемент исходного типа со всеми полями", () => {
    const found = findById(products, 1);
    if (found) {
      const title: string = found.title;
      const price: number = found.price;
      // @ts-expect-error
      found.missing;
    }
  });

  test("не принимает сущности без числового id", () => {
    // @ts-expect-error
    findById([{ name: "Без идентификатора" }], 1);
  });
});

describe("ApiResponse", () => {
  test("без параметра data имеет тип unknown", () => {
    const response: ApiResponse = { status: 200, data: "ok" };
    // @ts-expect-error
    const text: string = response.data;
  });

  test("с параметром data получает указанный тип", () => {
    const response: ApiResponse<string[]> = { status: 200, data: ["a", "b"] };
    const list: string[] = response.data;
    // @ts-expect-error
    const wrong: ApiResponse<string[]> = { status: 200, data: 1 };
  });
});

describe("longest", () => {
  test("возвращает тип переданных значений", () => {
    const array: number[] = longest([1, 2], [1, 2, 3]);
    const text: string = longest("ab", "abc");
  });

  test("не принимает значения без length", () => {
    // @ts-expect-error
    longest(10, 100);
  });
});
