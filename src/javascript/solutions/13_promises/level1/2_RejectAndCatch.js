const checkAge = (age) => {
  return new Promise((resolve, reject) => {
    if (age >= 18) resolve("Доступ разрешён");
    else reject("Доступ запрещён");
  });
};

checkAge(15).then(console.log).catch(console.error);
