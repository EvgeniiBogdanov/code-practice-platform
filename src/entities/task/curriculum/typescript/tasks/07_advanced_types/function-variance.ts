// Обработчик, принимающий любое животное, можно использовать там,
// где ожидается обработчик собак. Обратное небезопасно.
//
// 1. Объясните, почему присваивание handleDog в AnimalHandler
//    не вызывает ошибку, хотя приводит к падению во время выполнения.
// 2. Измените интерфейс AnimalHandler так, чтобы TypeScript ловил
//    эту ошибку.
// 3. Добавьте к Box явную аннотацию вариантности, чтобы Box<Dog>
//    можно было передать туда, где ожидается Box<Animal>, но не наоборот.

interface Animal {
  name: string;
}

interface Dog extends Animal {
  bark: () => void;
}

interface AnimalHandler {
  onEvent(animal: Animal): void;
}

const handleDog = (dog: Dog): void => {
  dog.bark();
};

const animalHandler: AnimalHandler = { onEvent: handleDog };
animalHandler.onEvent({ name: "Кот" }); // TypeError во время выполнения

interface Box<T> {
  readonly value: T;
}
