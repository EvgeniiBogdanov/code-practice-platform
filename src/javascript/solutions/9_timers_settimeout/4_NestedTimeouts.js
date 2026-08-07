// Порядок вывода: Start → End → Timeout 2 → Timeout 1 → Between timeouts → Nested Timeout

console.log('Start');

setTimeout(() => {
  console.log('Timeout 1');
    
  setTimeout(() => {
    console.log('Nested Timeout');
  }, 0);
    
  console.log('Between timeouts');
}, 1000);

setTimeout(() => {
  console.log('Timeout 2');
}, 500);

console.log('End');

// Пояснение:
// 1. Синхронно: 'Start' и 'End'.
// 2. Через 500мс срабатывает Timeout 2 -> 'Timeout 2'.
// 3. Через 1000мс срабатывает Timeout 1: выводит 'Timeout 1', планирует Nested Timeout, затем синхронно выводит 'Between timeouts'.
// 4. После освобождения стека срабатывает Nested Timeout -> 'Nested Timeout'.
