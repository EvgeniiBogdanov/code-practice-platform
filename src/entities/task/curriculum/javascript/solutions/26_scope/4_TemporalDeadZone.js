try {
  console.log(value); // value уже существует, но ещё не инициализирована
} catch (error) {
  console.log(error.name); // "ReferenceError"
}
let value = 1;

// Переменной нет вообще — typeof безопасен
console.log(typeof undeclaredVariable); // "undefined"

try {
  // Переменная в TDZ — даже typeof бросает ошибку
  console.log(typeof tdzVariable);
} catch (error) {
  console.log(error.name); // "ReferenceError"
}
let tdzVariable = "ok";

function getConfig() {
  return config; // функция ВЫЗВАНА после инициализации config — всё хорошо
}
const config = { debug: true };
console.log(getConfig().debug); // true

let x = 1;
{
  try {
    console.log(x); // в блоке есть своя x (ниже), она затеняет внешнюю и пока в TDZ
  } catch (error) {
    console.log(error.name); // "ReferenceError"
  }
  let x = 2;
}

try {
  new Service(); // class тоже поднимается с TDZ
} catch (error) {
  console.log(error.name); // "ReferenceError"
}
class Service {}
