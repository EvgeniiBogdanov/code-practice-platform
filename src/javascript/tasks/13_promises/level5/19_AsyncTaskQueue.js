// Напишите класс TaskQueue с методом add(taskFn), который
// добавляет асинхронную задачу в очередь. Задачи должны
// выполняться СТРОГО последовательно, одна за другой,
// даже если add() вызывается несколько раз подряд без ожидания.

class TaskQueue {
  add(taskFn) {
    // Ваш код здесь
  }
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const queue = new TaskQueue();
queue.add(() => delay(300).then(() => console.log("Задача 1")));
queue.add(() => delay(100).then(() => console.log("Задача 2")));
queue.add(() => delay(50).then(() => console.log("Задача 3")));
// Ожидаемый порядок вывода: 1, 2, 3 (несмотря на разные задержки)
