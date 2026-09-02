const myInstanceOf = (instance, Constructor) => {
  if (instance === null || (typeof instance !== "object" && typeof instance !== "function")) {
    return false;
  }

  if (typeof Constructor !== "function") {
    throw new TypeError("Right-hand side of 'instanceof' is not callable");
  }

  if (typeof Constructor[Symbol.hasInstance] === "function") {
    return Boolean(Constructor[Symbol.hasInstance](instance));
  }

  const targetPrototype = Constructor.prototype;
  if (!targetPrototype || (typeof targetPrototype !== "object" && typeof targetPrototype !== "function")) {
    throw new TypeError("Function has non-object prototype in instanceof check");
  }

  let currentProto = Object.getPrototypeOf(instance);
  while (currentProto !== null) {
    if (currentProto === targetPrototype) {
      return true;
    }
    currentProto = Object.getPrototypeOf(currentProto);
  }

  return false;
};

// Пример вызова:
console.log(myInstanceOf([], Array)); // true
console.log(myInstanceOf([], Object)); // true
console.log(myInstanceOf(123, Number)); // false (примитив)
console.log(myInstanceOf(new Number(123), Number)); // true
console.log(myInstanceOf({}, Array)); // false
