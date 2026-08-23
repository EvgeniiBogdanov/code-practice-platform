const checkAge = (age) => {
  return new Promise((resolve, reject) => {
    if (age >= 18) resolve("Доступ разрешён");
    else reject("Доступ запрещён");
  });
};

// Пример вызова:
checkAge(15).then(console.log).catch(console.error);
