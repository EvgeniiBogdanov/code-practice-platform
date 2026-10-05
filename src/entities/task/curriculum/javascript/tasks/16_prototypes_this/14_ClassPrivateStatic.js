// Классы: приватные поля, геттеры и статические члены
// Реализуйте класс BankAccount:
// - публичное поле owner (из конструктора);
// - приватное поле #balance (начальное значение 0) и приватный метод #validate(amount),
//   который бросает RangeError("Сумма должна быть положительной"), если amount <= 0;
// - методы deposit(amount) и withdraw(amount); при нехватке средств withdraw
//   бросает Error("Недостаточно средств");
// - геттер balance (только чтение, без сеттера);
// - статическое поле count — сколько счетов создано, и статический метод isAccount(value).

class BankAccount {
  // Решение тут
}

// Пример вызова:
const account = new BankAccount("Анна");
account.deposit(1000);
account.withdraw(300);
console.log(account.balance); // 700

try {
  account.balance = 1_000_000; // у свойства есть только геттер
} catch (error) {
  console.log(error.name); // "TypeError"
}
console.log(account.balance); // 700

try {
  account.withdraw(5000);
} catch (error) {
  console.log(error.message); // "Недостаточно средств"
}

try {
  account.deposit(-5);
} catch (error) {
  console.log(error.name, error.message); // "RangeError" "Сумма должна быть положительной"
}

new BankAccount("Олег");
console.log(BankAccount.count); // 2
console.log(BankAccount.isAccount(account)); // true
console.log(BankAccount.isAccount({ balance: 700 })); // false
console.log(Object.keys(account)); // ["owner"] — приватных полей не видно
