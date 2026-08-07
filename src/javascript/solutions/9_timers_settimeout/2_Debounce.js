const debounce = (func, delay) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId); // сбрасываем предыдущий таймер
    timeoutId = setTimeout(() => func(...args), delay); // создаем новый
  };
};

// Пример использования:
const debouncedSearch = debounce((query) => {
  console.log(`Searching for: ${query}`);
}, 300);

debouncedSearch('a');
debouncedSearch('ab');
debouncedSearch('abc'); // Только этот вызов сработает через 300мс
