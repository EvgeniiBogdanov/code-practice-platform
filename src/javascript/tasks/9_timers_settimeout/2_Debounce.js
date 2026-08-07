// Напишите функцию debounce(...), которая откладывает вызов функции до тех пор,
// пока не пройдет delay миллисекунд с момента последнего вызова.

// Пример использования:
const debouncedSearch = debounce((query) => {
  console.log(`Searching for: ${query}`);
}, 300);

// При быстром вводе вызовется только один раз
debouncedSearch('a');
debouncedSearch('ab');
debouncedSearch('abc'); // Только этот вызов сработает
