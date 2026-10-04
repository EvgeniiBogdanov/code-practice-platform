// Функции работают с массивами любых элементов, но сейчас
// тип элемента теряется. Типизируйте их так, чтобы результат
// сохранял тип элементов исходного массива.

const first = (items) => items[0];

const last = (items) => items[items.length - 1];

const wrapInArray = (value) => [value];

const n = first([1, 2, 3]); // должно быть number | undefined
const s = last(["a", "b"]); // должно быть string | undefined
const w = wrapInArray({ id: 1 }); // должно быть { id: number }[]
