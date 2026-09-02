class CurrencyAmount {
  constructor(amount, currency = "USD") {
    this.amount = Number(amount) || 0;
    this.currency = String(currency).toUpperCase();
  }

  [Symbol.toPrimitive](hint) {
    if (hint === "string") {
      return `${this.amount} ${this.currency}`;
    }
    // Для hint === 'number' и hint === 'default'
    return this.amount;
  }
}

// Пример вызова:
const wallet = new CurrencyAmount(100, "USD");

console.log(+wallet); // 100
console.log(`${wallet}`); // '100 USD'
console.log(wallet + 50); // 150
console.log(wallet == 100); // true
console.log(wallet - 20); // 80
