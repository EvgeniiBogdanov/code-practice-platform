// Если не указать начальное значение (0), reduce возьмёт первый элемент как аккумулятор
const arr = [1, 2, 3];
const result = arr.reduce((acc, num) => acc + num);

console.log(result); // 6
