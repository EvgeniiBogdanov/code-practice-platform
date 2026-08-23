const createCounter = () => {
  let count = 0; // Локальная переменная

  return () => ++count; // Возвращаем стрелочную функцию, которая увеличивает и возвращает count
};

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
