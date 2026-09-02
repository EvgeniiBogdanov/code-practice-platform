// Что выведет данный код в консоль и почему?

var funcs = [];
for (var i = 0; i < 3; i++) {
  funcs.push(function () {
    return i;
  });
}

console.log(funcs[0]());
console.log(funcs[1]());
console.log(funcs[2]());
