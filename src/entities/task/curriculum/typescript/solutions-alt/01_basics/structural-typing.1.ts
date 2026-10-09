// Альтернативный эталон: индексная сигнатура вместо параметра типа.
interface Point {
  x: number;
  y: number;
  [extra: string]: unknown;
}

const printPoint = (point: Point): void => {
  console.log(`(${point.x}, ${point.y})`);
};

const point3d = { x: 1, y: 2, z: 3 };
printPoint(point3d);
printPoint({ x: 1, y: 2, z: 3 });

interface Celsius {
  unit: "C";
  value: number;
}

interface Fahrenheit {
  unit: "F";
  value: number;
}

const saveCelsius = (temperature: Celsius): void => {
  console.log(`${temperature.value} °C`);
};

const outside: Fahrenheit = { unit: "F", value: 451 };
const inside: Celsius = { unit: "C", value: 21 };
saveCelsius(inside);
