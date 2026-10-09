describe("move", () => {
  test("принимает рыбу и птицу", () => {
    move({ swim: () => {} });
    move({ fly: () => {} });
  });

  test("не принимает другие объекты", () => {
    // @ts-expect-error
    move({ run: () => {} });
    // @ts-expect-error
    move("fish");
  });
});

describe("formatDate", () => {
  test("принимает Date или строку и возвращает строку", () => {
    const fromDate: string = formatDate(new Date(2024, 0, 15));
    const fromString: string = formatDate("2024-01-15");
  });

  test("не принимает числа", () => {
    // @ts-expect-error
    formatDate(1705276800000);
  });
});
