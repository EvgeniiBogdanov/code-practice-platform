const invertObject = (obj) => {
  const inverted = {};

  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      inverted[obj[key]] = key;
    }
  }

  return inverted;
};

// Пример вызова:
const roles = {
  admin: "1",
  editor: "2",
  viewer: "3",
};

console.log(invertObject(roles));
// { "1": "admin", "2": "editor", "3": "viewer" }
