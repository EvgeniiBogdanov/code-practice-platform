// Что выведет данный код в консоль и почему?

let number = 0;

const increment = () => {
  number += 1;
  const message = `Incremented to ${number}`;

  return () => {
    console.log(message);
    console.log(`Number: ${number}`);
  };
};

const log = increment();
increment();
increment();
log();

