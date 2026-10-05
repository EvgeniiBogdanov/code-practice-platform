Function.prototype.myBind = function (context, ...presetArgs) {
  const originalFn = this;

  if (typeof originalFn !== "function") {
    throw new TypeError("myBind можно вызвать только у функции");
  }

  return function boundFn(...laterArgs) {
    const args = [...presetArgs, ...laterArgs];

    // new.target определён, только если boundFn вызвали через new.
    // В этом случае привязанный context игнорируется — как у встроенного bind.
    if (new.target) {
      return new originalFn(...args);
    }

    // this внутри boundFn не используется — поэтому call/apply и повторный bind его не меняют
    return originalFn.apply(context, args);
  };
};

// Пример вызова:
const user = { name: "Анна" };
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const boundGreet = greet.myBind(user, "Привет");
console.log(boundGreet("!")); // "Привет, Анна!"
console.log(boundGreet.call({ name: "Олег" }, "?")); // "Привет, Анна?"

const rebound = boundGreet.myBind({ name: "Мария" });
console.log(rebound("!")); // "Привет, Анна!"

function Point(x, y) {
  this.x = x;
  this.y = y;
}
const BoundPoint = Point.myBind({ ignored: true }, 10);
const point = new BoundPoint(20);
console.log(point.x, point.y); // 10 20
console.log(point instanceof Point); // true
console.log(point.ignored); // undefined
