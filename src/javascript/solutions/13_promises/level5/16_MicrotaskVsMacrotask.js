console.log("1"); // 1

setTimeout(() => console.log("2"), 0); // 2 (макрозадача)

Promise.resolve()
  .then(() => console.log("3")) // 3 (микрозадача)
  .then(() => console.log("4")); // 4 (микрозадача)

console.log("5"); // 5
// Порядок вывода: 1, 5, 3, 4, 2
