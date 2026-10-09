test("Getters добавляет get и делает имя поля заглавным", () => {
  type _ = Expect<
    Equal<
      Getters<Person>,
      { getName: () => string; getAge: () => number; getIsAdmin: () => boolean }
    >
  >;
  type __ = Expect<Equal<Getters<{ title: string }>, { getTitle: () => string }>>;
});

test("PickByValue оставляет только поля с подходящим значением", () => {
  type _ = Expect<Equal<PickByValue<Person, string | number>, { name: string; age: number }>>;
  type __ = Expect<Equal<PickByValue<Person, boolean>, { isAdmin: boolean }>>;
});

test("ChangeHandlers создаёт onИмяChange с типом значения поля", () => {
  type _ = Expect<
    Equal<
      ChangeHandlers<Person>,
      {
        onNameChange: (value: string) => void;
        onAgeChange: (value: number) => void;
        onIsAdminChange: (value: boolean) => void;
      }
    >
  >;
});
