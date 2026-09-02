const createSecureEntity = (id, secretToken, initialRole = "user") => {
  const entity = {};
  let currentRole = ["user", "admin"].includes(initialRole) ? initialRole : "user";

  Object.defineProperty(entity, "id", {
    value: id,
    writable: false,
    enumerable: true,
    configurable: false,
  });

  Object.defineProperty(entity, "secretToken", {
    value: secretToken,
    writable: false,
    enumerable: false,
    configurable: false,
  });

  Object.defineProperty(entity, "role", {
    get() {
      return currentRole;
    },
    set(newRole) {
      if (!["user", "admin"].includes(newRole)) {
        throw new TypeError("Invalid role: must be 'user' or 'admin'");
      }
      currentRole = newRole;
    },
    enumerable: true,
    configurable: false,
  });

  return entity;
};

// Пример вызова:
const entity = createSecureEntity(101, "tok_secret_999", "admin");

console.log(Object.keys(entity)); // [ 'id', 'role' ]
console.log(entity.id); // 101
console.log(entity.secretToken); // 'tok_secret_999'
console.log(entity.role); // 'admin'
console.log(JSON.stringify(entity)); // '{"id":101,"role":"admin"}'
console.log(delete entity.id); // false
console.log(entity.id); // 101
