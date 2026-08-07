// ИСПРАВЛЕНИЕ (Используем let): 

const arr = [10, 12, 15, 21];

for (let i = 0; i < arr.length; i++) {
  setTimeout(function () {
    console.log("Index: " + i + ", element: " + arr[i]);
  }, 1000);
}

// ВЫВОД: 
// Index: 0, element: 10
// Index: 1, element: 12
// Index: 2, element: 15
// Index: 3, element: 21
