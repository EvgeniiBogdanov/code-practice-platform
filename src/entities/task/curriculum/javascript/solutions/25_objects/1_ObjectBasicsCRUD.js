const manageUser = (user, newKey, newValue, deleteKey) => {
  if (user && typeof user === "object") {
    if (newKey) {
      user[newKey] = newValue;
    }
    if (deleteKey) {
      delete user[deleteKey];
    }
  }
  return user;
};

// Пример вызова:
const user = { name: "Alice", age: 25, role: "admin" };
console.log(manageUser(user, "city", "Berlin", "role"));
// { name: 'Alice', age: 25, city: 'Berlin' }

const user2 = { id: 101, tempStatus: "pending" };
console.log(manageUser(user2, "isActive", true, "tempStatus"));
// { id: 101, isActive: true }
