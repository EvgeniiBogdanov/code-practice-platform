// Что выведет данный код в консоль и почему?

function show() {
  console.log(this.x);
}

const obj1 = { x: 10 };
const obj2 = { x: 20 };
const obj3 = { x: 30 };

const bound = show.bind(obj1).bind(obj2).bind(obj3);
bound();
