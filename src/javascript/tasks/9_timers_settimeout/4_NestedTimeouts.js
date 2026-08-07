// Вопрос: Какой будет порядок вывода и почему?

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
