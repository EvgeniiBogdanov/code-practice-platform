// Замыкание на строковое значение
// Что выведет вызов log() и как исправить?

function createIncrement() {
  let count = 0;

  function increment() {
    count++;
  }

  function log() {
    console.log(`Count is ${count}`);
  }

  return [increment, log];
}

const [increment, log] = createIncrement();
increment();
increment();
increment();
log();
