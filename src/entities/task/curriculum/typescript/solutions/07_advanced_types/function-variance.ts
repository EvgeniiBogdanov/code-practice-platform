interface Animal {
  name: string;
}

interface Dog extends Animal {
  bark: () => void;
}

// Свойство-функция проверяется строго (контравариантно) при strictFunctionTypes,
// метод — бивариантно.
interface AnimalHandler {
  onEvent: (animal: Animal) => void;
}

const handleDog = (dog: Dog): void => {
  dog.bark();
};

const handleAnimal = (animal: Animal): void => {
  console.log(animal.name);
};

// { onEvent: handleDog } не подходит под AnimalHandler: Animal нельзя передать как Dog
// (проверяется в tests.ts).
const animalHandler: AnimalHandler = { onEvent: handleAnimal };
animalHandler.onEvent({ name: "Кот" });

// out: T только «выходит» из Box, поэтому Box ковариантен по T.
interface Box<out T> {
  readonly value: T;
}

const dogBox: Box<Dog> = { value: { name: "Рекс", bark: () => console.log("Гав") } };
const animalBox: Box<Animal> = dogBox; // можно: каждая собака — животное
// Обратное присваивание Box<Animal> в Box<Dog> невозможно: не каждое животное — собака.
