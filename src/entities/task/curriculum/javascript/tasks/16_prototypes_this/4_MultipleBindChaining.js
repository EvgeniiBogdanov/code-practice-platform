// Повторный вызов .bind() на связанной функции
// Что выведет данный код?

function getInfo() {
  return this.title;
}

const obj1 = { title: "Книга 1" };
const obj2 = { title: "Книга 2" };

const bound1 = getInfo.bind(obj1);
const bound2 = bound1.bind(obj2);

console.log(bound2());
