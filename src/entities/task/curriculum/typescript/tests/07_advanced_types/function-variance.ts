test("обработчик собак нельзя использовать как обработчик животных", () => {
  // @ts-expect-error
  const handler: AnimalHandler = { onEvent: handleDog };
});

test("обработчик любых животных подходит", () => {
  const handler: AnimalHandler = { onEvent: (animal: Animal) => console.log(animal.name) };
  handler.onEvent({ name: "Кот" });
});

test("Box<Dog> можно передать туда, где ожидается Box<Animal>", () => {
  const dogBox: Box<Dog> = { value: { name: "Рекс", bark: () => {} } };
  const animalBox: Box<Animal> = dogBox;
});
