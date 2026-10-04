// Типизируйте функции так, чтобы внутри каждой ветки были доступны
// только допустимые для неё свойства и методы.

interface Fish {
  swim: () => void;
}

interface Bird {
  fly: () => void;
}

const move = (animal) => {
  // рыба плавает, птица летает
};

const formatDate = (value) => {
  // value — объект Date или строка в формате ISO.
  // Верните дату в виде строки через toLocaleDateString("ru-RU").
};

move({ swim: () => console.log("Плывёт") });
formatDate(new Date(2024, 0, 15));
formatDate("2024-01-15");
