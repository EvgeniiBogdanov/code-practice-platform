// Исходный вывод с var: 3, 3, 3

// Вариант исправления с let (рекомендуется):
const button = document.getElementById("button");

for (let i = 0; i < 3; i++) {
  button.addEventListener("click", function (e) {
    console.log(i); // 0, 1, 2
  });
}

button.click();
