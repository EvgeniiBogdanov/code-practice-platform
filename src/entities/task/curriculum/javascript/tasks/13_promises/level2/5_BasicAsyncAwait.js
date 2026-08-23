// Переписывание цепочки then на async/await
// Перепишите функцию loadUser с использованием async/await.

const getUser = () => Promise.resolve({ id: 1, name: "Maria" });

const loadUser = async () => {
  // Решение тут
};

// Пример вызова:
loadUser().then(console.log); // "Привет, Maria"
