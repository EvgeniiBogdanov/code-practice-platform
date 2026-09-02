// Реализация [Symbol.toPrimitive] для кастомного приведения типов
// Реализуйте класс CurrencyAmount(amount, currency) с поддержкой [Symbol.toPrimitive](hint).
// - При hint === "string" возвращает "${amount} ${currency}"
// - При hint === "number" или "default" возвращает числовое значение amount.

class CurrencyAmount {
  // Решение тут
}

// Пример вызова:
const wallet = new CurrencyAmount(100, "USD");
console.log(+wallet);       // 100
console.log(`${wallet}`);   // '100 USD'
console.log(wallet + 50);   // 150
console.log(wallet == 100); // true
