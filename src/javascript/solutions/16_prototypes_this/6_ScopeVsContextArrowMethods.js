function foo() {
  const x = 10;

  return {
    x: 20,

    bar() {
      console.log(this.x);
    },

    baz: () => {
      console.log(this.x);
    },
  };
}

const obj1 = foo();
obj1.bar(); // 20
obj1.baz(); // undefined

const obj2 = foo.call({ x: 30 });
let y = obj2.bar;
let x = obj2.baz;

y(); // undefined (потеря контекста)
x(); // 30 (стрелочная функция запомнила { x: 30 } при вызове foo.call)

obj2.bar(); // 20
obj2.baz(); // 30
