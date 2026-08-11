const getUser = async (id) => {
  return { id, name: "Пользователь " + id };
};

// Пример вызова:
getUser(42).then((user) => console.log(user)); // { id: 42, name: "Пользователь 42" }
