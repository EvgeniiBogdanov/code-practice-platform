console.log("Start"); // Start
console.log("End");   // End

setTimeout(() => {
  console.log("Timeout"); // Timeout (через 500 мс)
}, 500);

setInterval(() => {
  console.log("Interval"); // Interval (через 1000 мс, 2000 мс...)
}, 1000);
