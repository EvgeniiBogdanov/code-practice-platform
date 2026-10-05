const letters = ["a", "b", "c", "d", "e"];

// slice(start, end) — копия части массива, end не включается. Исходник не меняется.
const part = letters.slice(1, 3);
console.log(part); // ["b", "c"]
console.log(letters); // ["a", "b", "c", "d", "e"]

// splice(start, deleteCount) — вырезает элементы ИЗ исходного массива и возвращает их
const removed = letters.splice(1, 2);
console.log(removed); // ["b", "c"]
console.log(letters); // ["a", "d", "e"]

// splice(start, 0, ...items) — вставка без удаления
letters.splice(1, 0, "X", "Y");
console.log(letters); // ["a", "X", "Y", "d", "e"]

// Отрицательный индекс считается с конца
console.log(letters.slice(-2)); // ["d", "e"]

// sort мутирует массив и возвращает ТОТ ЖЕ массив
const numbers = [3, 1, 2];
const sorted = numbers.sort();
console.log(sorted === numbers); // true
console.log(numbers); // [1, 2, 3]

// Чтобы не мутировать — сначала копия
const reversed = [...numbers].reverse();
console.log(numbers); // [1, 2, 3]
console.log(reversed); // [3, 2, 1]
