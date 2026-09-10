let counter = 0;

function startInterval() {
  return setInterval(() => {
    counter++;
    console.log(`Counter: ${counter}`);
  }, 1000);
}

const id1 = startInterval();
const id2 = startInterval();

setTimeout(() => {
  clearInterval(id1);
  console.log("Stopped first interval");
}, 2500);

// Порядок вывода в консоль:
// Counter: 1 (через 1000 мс от id1)
// Counter: 2 (через 1000 мс от id2)
// Counter: 3 (через 2000 мс от id1)
// Counter: 4 (через 2000 мс от id2)
// Stopped first interval (через 2500 мс, id1 очищается)
// Counter: 5 (через 3000 мс от id2)
// ...далее id2 продолжает выводить Counter: 6, Counter: 7 каждые 1000 мс

