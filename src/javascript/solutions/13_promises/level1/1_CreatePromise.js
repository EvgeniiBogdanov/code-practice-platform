const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve("done"), ms);
  });
};

delay(1000).then(console.log);
