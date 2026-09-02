// Реализация функции debounce
// Напишите функцию debounce(fn, ms), которая откладывает вызов функции fn до тех пор, пока с момента последнего вызова не пройдет ms миллисекунд.

const debounce = (fn, ms) => {
  // Решение тут
};

// Пример вызова:
const log = debounce((val) => console.log("Debounced:", val), 200);
log(1);
log(2);
log(3); // Выведет "Debounced: 3" через 200 мс
