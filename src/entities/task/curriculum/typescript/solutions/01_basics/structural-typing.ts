interface Point {
  x: number;
  y: number;
}

// Параметр типа принимает точный тип аргумента, поэтому проверка
// лишних свойств к литералу не применяется, а x и y по-прежнему обязаны быть числами.
const printPoint = <T extends Point>(point: T): void => {
  console.log(`(${point.x}, ${point.y})`);
};

const point3d = { x: 1, y: 2, z: 3 };
printPoint(point3d);
printPoint({ x: 1, y: 2, z: 3 });

// Литеральное поле unit делает структуры несовместимыми.
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
// saveCelsius(outside); // Ошибка: "F" нельзя присвоить "C"
saveCelsius({ unit: "C", value: 21 });
