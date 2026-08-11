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
log(); // Count is 3
