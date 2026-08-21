const invertObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [value, key])
  );
};

// Пример вызова:
const roles = {
  admin: "1",
  editor: "2",
  viewer: "3",
};

console.log(invertObject(roles));
// { "1": "admin", "2": "editor", "3": "viewer" }
