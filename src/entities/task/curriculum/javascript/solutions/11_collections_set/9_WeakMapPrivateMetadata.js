class SecureSessionManager {
  #store = new WeakMap();

  #validateKey(key) {
    if (key === null || (typeof key !== "object" && typeof key !== "function")) {
      throw new TypeError("Invalid key: WeakMap keys must be non-null objects");
    }
  }

  setSession(userObj, token) {
    this.#validateKey(userObj);
    this.#store.set(userObj, token);
  }

  getSession(userObj) {
    this.#validateKey(userObj);
    return this.#store.has(userObj) ? this.#store.get(userObj) : null;
  }

  hasSession(userObj) {
    this.#validateKey(userObj);
    return this.#store.has(userObj);
  }

  removeSession(userObj) {
    this.#validateKey(userObj);
    return this.#store.delete(userObj);
  }
}

// Пример вызова:
const manager = new SecureSessionManager();
let userAlice = { id: 101, name: "Alice" };

manager.setSession(userAlice, "auth_jwt_token_alice_secret");
console.log(manager.getSession(userAlice)); // 'auth_jwt_token_alice_secret'
console.log(manager.hasSession(userAlice)); // true
console.log(Object.keys(userAlice)); // [ 'id', 'name' ]

manager.removeSession(userAlice);
console.log(manager.hasSession(userAlice)); // false
console.log(manager.getSession(userAlice)); // null
