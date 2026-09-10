// Постройте цепочку вызовов .then(): вызвать getUser(), извлечь user.id и вывести в консоль `User id: ${id}`.

const getUser = () => Promise.resolve({ id: 42, name: "Alex" });

// Решение тут:
getUser()
  .then((user) => {
    // Решение тут
  });
