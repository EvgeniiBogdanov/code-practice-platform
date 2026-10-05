// async-функция всегда возвращает Promise.
// await приостанавливает выполнение функции до завершения промиса,
// а отклонённый промис превращается в исключение, которое ловит try/catch.

const loadData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    // Логируем и пробрасываем дальше: решение, что показать пользователю,
    // принимает вызывающий код
    console.error('Не удалось загрузить данные:', error);
    throw error;
  } finally {
    // Выполняется всегда: и при успехе, и при ошибке (например, скрыть лоадер)
    console.log('Запрос завершён');
  }
};

// Вызов: async-функцию тоже нужно дождаться
// const data = await loadData('https://jsonplaceholder.typicode.com/users');
