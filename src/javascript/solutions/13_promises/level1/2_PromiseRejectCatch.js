const checkNumber = (num) => {
  return new Promise((resolve, reject) => {
    if (num > 0) {
      resolve("Число положительное");
    } else {
      reject(new Error("Число должно быть больше 0"));
    }
  });
};

// Пример вызова:
checkNumber(5).then(console.log).catch((err) => console.error(err.message)); // "Число положительное"
checkNumber(-2).then(console.log).catch((err) => console.error(err.message)); // "Число должно быть больше 0"
