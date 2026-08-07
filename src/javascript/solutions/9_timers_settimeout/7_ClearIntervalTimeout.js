let counter = 0;
const timerId = setInterval(() => {
  counter++;
  console.log(`Tick ${counter}`);
    
  if (counter === 3) {
    clearInterval(timerId);
    console.log('Stopped');
  }
}, 1000);

setTimeout(() => {
  console.log('Timeout finished');
}, 5000);
