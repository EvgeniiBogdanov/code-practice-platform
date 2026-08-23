console.log("Start"); // Start

setTimeout(() => {
  console.log("Timeout 1"); // Timeout 1
  setTimeout(() => {
    console.log("Nested Timeout"); // Nested Timeout
  }, 0);
}, 0);

setTimeout(() => {
  console.log("Timeout 2"); // Timeout 2
}, 0);

console.log("End"); // End
