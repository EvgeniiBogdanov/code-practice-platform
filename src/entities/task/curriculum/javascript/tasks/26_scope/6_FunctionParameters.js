// Параметры функций: значения по умолчанию, rest и arguments
// 1. greet(name, greeting) — greeting по умолчанию "Привет", name по умолчанию "гость".
// 2. sumAll(...) — суммирует любое количество чисел (используйте rest-параметр).
// 3. collectArgs() — без объявленных параметров возвращает настоящий массив
//    всех переданных аргументов (используйте объект arguments).

function greet(name, greeting) {
  // Решение тут
}

function sumAll() {
  // Решение тут
}

function collectArgs() {
  // Решение тут
}

// Пример вызова:
console.log(greet("Анна")); // "Привет, Анна!"
console.log(greet("Олег", "Здравствуйте")); // "Здравствуйте, Олег!"
console.log(greet(undefined, "Добрый день")); // "Добрый день, гость!"
console.log(greet(null)); // "Привет, null!"
console.log(sumAll()); // 0
console.log(sumAll(1, 2, 3, 4)); // 10
console.log(collectArgs("a", 1, true)); // ["a", 1, true]
console.log(Array.isArray(collectArgs())); // true
