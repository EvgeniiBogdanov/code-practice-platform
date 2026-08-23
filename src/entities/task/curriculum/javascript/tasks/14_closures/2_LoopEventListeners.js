// - Что выведется в консоль; - Варианты, как исправить;

const button = document.getElementById("button");

for (var i = 0; i < 3; i++) {
  button.addEventListener("click", function (e) {
    console.log(i);
  });
}

button.click();
