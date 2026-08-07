const createTimer = (seconds) => {
  let timeLeft = seconds;
  
  const intervalId = setInterval(() => {
    console.log(timeLeft);
    timeLeft--;

    if (timeLeft <= 0) {
      clearInterval(intervalId);
      console.log("Time's up!");
    }
  }, 1000);

  return intervalId;
};

createTimer(5);
