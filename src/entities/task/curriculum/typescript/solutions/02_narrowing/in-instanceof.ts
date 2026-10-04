interface Fish {
  swim: () => void;
}

interface Bird {
  fly: () => void;
}

const move = (animal: Fish | Bird): void => {
  if ("swim" in animal) {
    animal.swim(); // animal: Fish
    return;
  }

  animal.fly(); // animal: Bird
};

const formatDate = (value: Date | string): string => {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString("ru-RU");
};

move({ swim: () => console.log("Плывёт") });
formatDate(new Date(2024, 0, 15)); // "15.01.2024"
formatDate("2024-01-15"); // ISO-дата без времени разбирается как полночь UTC
