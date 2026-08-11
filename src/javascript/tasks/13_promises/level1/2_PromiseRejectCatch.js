// Отклонение Promise и обработка ошибки
// Напишите функцию checkNumber(num), которая возвращает Promise:
// - Если num > 0 -> resolve("Число положительное")
// - Если num <= 0 -> reject(new Error("Число должно быть больше 0"))

const checkNumber = (num) => {
  // Решение тут
};

// Пример вызова:
checkNumber(5).then(console.log).catch((err) => console.error(err.message)); // "Число положительное"
checkNumber(-2).then(console.log).catch((err) => console.error(err.message)); // "Число должно быть больше 0"
