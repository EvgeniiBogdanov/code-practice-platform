// Что выведет данный код в консоль и почему?

function User(name) {
  this.name = name;
}

User.prototype.skills = [];

const u1 = new User("Alice");
const u2 = new User("Bob");

u1.skills.push("JS");

console.log(u1.skills);
console.log(u2.skills);
