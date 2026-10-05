class BankAccount {
  // Статическое поле принадлежит классу, а не экземплярам
  static count = 0;

  // Приватное поле: доступно только внутри тела класса
  #balance = 0;

  constructor(owner) {
    this.owner = owner;
    BankAccount.count += 1;
  }

  // Приватный метод
  #validate(amount) {
    if (amount <= 0) {
      throw new RangeError("Сумма должна быть положительной");
    }
  }

  deposit(amount) {
    this.#validate(amount);
    this.#balance += amount;
  }

  withdraw(amount) {
    this.#validate(amount);
    if (amount > this.#balance) {
      throw new Error("Недостаточно средств");
    }
    this.#balance -= amount;
  }

  // Геттер без сеттера — свойство только для чтения
  get balance() {
    return this.#balance;
  }

  static isAccount(value) {
    return value instanceof BankAccount;
  }
}

// Пример вызова:
const account = new BankAccount("Анна");
account.deposit(1000);
account.withdraw(300);
console.log(account.balance); // 700

try {
  account.balance = 1_000_000; // в строгом режиме запись в свойство без сеттера — TypeError
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
console.log(Object.keys(account)); // ["owner"]
