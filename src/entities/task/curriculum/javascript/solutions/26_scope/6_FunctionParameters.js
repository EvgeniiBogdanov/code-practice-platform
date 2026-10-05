// Значение по умолчанию подставляется только для undefined (не для null)
function greet(name = "гость", greeting = "Привет") {
  return `${greeting}, ${name}!`;
}

// rest-параметр собирает «хвост» аргументов в настоящий массив
function sumAll(...numbers) {
  return numbers.reduce((sum, n) => sum + n, 0);
}

// arguments — псевдомассив: есть length и индексы, но нет методов массива
function collectArgs() {
  return Array.from(arguments);
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
