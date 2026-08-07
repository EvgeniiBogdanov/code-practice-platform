const text = 'hello world hello set world';

const arr = text.split(' ');
const unique = [...new Set(arr)];

console.log(unique); // ['hello', 'world', 'set']
