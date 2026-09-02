// Что выведет данный код в консоль и почему?

function createLogger() {
  let message = "Привет";
  return function () {
    console.log(message);
  };
}

let log = createLogger();
message = "Пока";
log();
