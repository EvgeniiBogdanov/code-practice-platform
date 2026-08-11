// Реализация Debounce с немедленным вызовом (leading option)
// Напишите функцию debounce(fn, wait, immediate).

const debounce = (fn, wait, immediate = false) => {
  // Решение тут
};

// Пример вызова:
const log = debounce((val) => console.log(val), 200);
log(1);
log(2);
log(3); // Выведет 3 через 200 мс
