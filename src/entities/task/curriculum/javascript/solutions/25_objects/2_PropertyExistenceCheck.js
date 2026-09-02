const hasProperty = (obj, prop, checkPrototype = false) => {
  if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
    return false;
  }

  if (checkPrototype) {
    return prop in obj;
  }

  return Object.hasOwn(obj, prop);
};

// Пример вызова:
const proto = { inheritedProp: "from proto" };
const user = Object.create(proto);
user.ownProp = "own value";
user.falsyProp = undefined;

console.log(hasProperty(user, "ownProp", false));         // true
console.log(hasProperty(user, "falsyProp", false));       // true
console.log(hasProperty(user, "inheritedProp", false));   // false
console.log(hasProperty(user, "inheritedProp", true));    // true
console.log(hasProperty(user, "toString", true));         // true

const cleanObj = Object.create(null);
cleanObj.secret = 42;
console.log(hasProperty(cleanObj, "secret", false));      // true
console.log(hasProperty(cleanObj, "missing", false));     // false
