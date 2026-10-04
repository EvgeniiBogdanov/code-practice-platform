// 1. Вызов printPoint с переменной point3d проходит проверку,
//    а вызов с таким же объектным литералом — нет. Почему?
//    Сделайте так, чтобы printPoint явно принимала точки с любыми
//    дополнительными полями, переданные и литералом, не ослабляя
//    типы полей x и y.
//
// 2. saveCelsius принимает температуру в Фаренгейтах, потому что
//    оба интерфейса описывают объект { value: number }. Измените
//    модели так, чтобы такой вызов стал ошибкой типизации.

interface Point {
  x: number;
  y: number;
}

const printPoint = (point: Point): void => {
  console.log(`(${point.x}, ${point.y})`);
};

const point3d = { x: 1, y: 2, z: 3 };
printPoint(point3d);
printPoint({ x: 1, y: 2, z: 3 });

interface Celsius {
  value: number;
}

interface Fahrenheit {
  value: number;
}

const saveCelsius = (temperature: Celsius): void => {
  console.log(`${temperature.value} °C`);
};

const outside: Fahrenheit = { value: 451 };
saveCelsius(outside); // должно быть ошибкой
