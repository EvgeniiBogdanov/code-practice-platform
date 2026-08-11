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
// Incremented to 1
// Number: 3
