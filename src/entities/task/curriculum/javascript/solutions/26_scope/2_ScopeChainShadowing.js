let name = "global";

function outer() {
  let name = "outer"; // затеняет (shadowing) глобальную name

  function inner() {
    console.log(name); // ищем name: inner -> outer (нашли)
  }

  inner();
}

outer(); // "outer"

function readName() {
  console.log(name); // readName объявлена в глобальной области
}

function withLocalName() {
  let name = "local";
  readName(); // область видимости определяется местом ОБЪЯВЛЕНИЯ, а не вызова
}

withLocalName(); // "global"

let count = 1;
{
  let count = 2; // новая переменная в блоке
  console.log(count); // 2
}
console.log(count); // 1

function update() {
  count = 100; // своей count нет — меняем внешнюю
}
update();
console.log(count); // 100
