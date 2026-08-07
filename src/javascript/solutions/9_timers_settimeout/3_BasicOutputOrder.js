// Порядок вывода: 1, 3, 2

console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

console.log('3');

// Пояснение:
// 1. console.log('1') выполняется синхронно -> '1'
// 2. setTimeout регистрирует колбэк в Web APIs/Event Loop (макрозадача)
// 3. console.log('3') выполняется синхронно -> '3'
// 4. Синхронный стек пуст, Event Loop достает колбэк setTimeout -> '2'
