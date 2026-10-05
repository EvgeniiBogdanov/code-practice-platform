// Что выведет данный код в консоль и почему?

let name = "global";

function outer() {
  let name = "outer";

  function inner() {
    console.log(name);
  }

  inner();
}

outer();

function readName() {
  console.log(name);
}

function withLocalName() {
  let name = "local";
  readName();
}

withLocalName();

let count = 1;
{
  let count = 2;
  console.log(count);
}
console.log(count);

function update() {
  count = 100;
}
update();
console.log(count);
