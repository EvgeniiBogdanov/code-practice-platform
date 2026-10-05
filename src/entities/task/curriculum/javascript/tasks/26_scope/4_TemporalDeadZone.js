// Что выведет данный код в консоль и почему?
// Если строка бросает ошибку — напишите имя ошибки.

try {
  console.log(value);
} catch (error) {
  console.log(error.name);
}
let value = 1;

console.log(typeof undeclaredVariable);

try {
  console.log(typeof tdzVariable);
} catch (error) {
  console.log(error.name);
}
let tdzVariable = "ok";

function getConfig() {
  return config;
}
const config = { debug: true };
console.log(getConfig().debug);

let x = 1;
{
  try {
    console.log(x);
  } catch (error) {
    console.log(error.name);
  }
  let x = 2;
}

try {
  new Service();
} catch (error) {
  console.log(error.name);
}
class Service {}
