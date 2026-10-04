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

// const animalHandler: AnimalHandler = { onEvent: handleDog }; // Ошибка: Animal нельзя передать как Dog
const animalHandler: AnimalHandler = { onEvent: handleAnimal };
animalHandler.onEvent({ name: "Кот" });

// out: T только «выходит» из Box, поэтому Box ковариантен по T.
interface Box<out T> {
  readonly value: T;
}

const dogBox: Box<Dog> = { value: { name: "Рекс", bark: () => console.log("Гав") } };
const animalBox: Box<Animal> = dogBox; // можно: каждая собака — животное
// const anotherDogBox: Box<Dog> = animalBox; // Ошибка: не каждое животное — собака
