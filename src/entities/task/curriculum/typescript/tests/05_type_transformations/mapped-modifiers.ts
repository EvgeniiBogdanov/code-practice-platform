describe("MyReadonly", () => {
  test("делает все поля только для чтения", () => {
    type _ = Expect<
      Equal<MyReadonly<{ a: number; b?: string }>, { readonly a: number; readonly b?: string }>
    >;
  });

  test("запрещает присваивание полям", () => {
    const frozen: MyReadonly<Todo> = { id: 1, title: "Купить хлеб" };
    // @ts-expect-error
    frozen.title = "Изменить";
  });
});

test("MyPartial делает все поля необязательными", () => {
  type _ = Expect<Equal<MyPartial<{ a: number; b: string }>, { a?: number; b?: string }>>;
  const draft: MyPartial<Todo> = {};
});

describe("MyRequired", () => {
  test("делает все поля обязательными", () => {
    type _ = Expect<Equal<MyRequired<{ a?: number; b?: string }>, { a: number; b: string }>>;
  });

  test("не принимает объект без необязательных полей исходного типа", () => {
    const complete: MyRequired<Todo> = { id: 1, title: "Купить хлеб", done: false };
    // @ts-expect-error
    const incomplete: MyRequired<Todo> = { id: 1, title: "Купить хлеб" };
  });
});

test("Mutable снимает readonly со всех полей", () => {
  type _ = Expect<Equal<Mutable<{ readonly a: number; b: string }>, { a: number; b: string }>>;
  const editable: Mutable<Todo> = { id: 1, title: "Купить хлеб" };
  editable.id = 2;
});
