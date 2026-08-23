// Что будет выведено в консоль? И как исправить проблему?

function createIncrement() {
  let count = 0;

  function increment() {
    count++;
  }

  let message = `Count is ${count}`;

  function log() {
    console.log(message);
  }

  return [increment, log];
}

const [increment, log] = createIncrement();
increment();
increment();
increment();
log(); // Что выведет и в чем проблема?
