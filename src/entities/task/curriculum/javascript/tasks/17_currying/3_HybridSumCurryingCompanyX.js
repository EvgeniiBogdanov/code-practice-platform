// Каррирование с приведением типов (valueOf / Symbol.toPrimitive)
// Напишите функцию sum(a), поддерживающую вызов sum(1)(2)(3) == 6.

function sum(a) {
  // Решение тут
}

// Пример вызова:
console.log(Number(sum(1)(2)(3))); // 6
console.log(+sum(2)(4));           // 6
