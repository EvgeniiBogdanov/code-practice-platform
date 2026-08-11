const arr = [10, 12, 15, 21];

for (let i = 0; i < arr.length; i++) {
  setTimeout(() => {
    console.log("Index: " + i + ", element: " + arr[i]);
  }, 100);
}
