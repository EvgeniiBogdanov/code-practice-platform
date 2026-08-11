function User(name) {
  this.name = name;
}

User.prototype.skills = [];

const u1 = new User("Иван");
const u2 = new User("Ольга");

u1.skills.push("JS");

console.log(u2.skills); // ["JS"]
