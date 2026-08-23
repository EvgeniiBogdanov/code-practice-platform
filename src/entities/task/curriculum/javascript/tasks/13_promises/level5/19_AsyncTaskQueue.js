// Очередь асинхронных задач (TaskQueue)
// Реализуйте класс TaskQueue с методом add(taskFn), где задачи выполняются строго последовательно.

class TaskQueue {
  add(taskFn) {
    // Решение тут
  }
}

// Пример вызова:
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const queue = new TaskQueue();
queue.add(() => delay(100).then(() => console.log("Задача 1")));
queue.add(() => delay(50).then(() => console.log("Задача 2")));
queue.add(() => delay(20).then(() => console.log("Задача 3")));
// Вывод: "Задача 1", "Задача 2", "Задача 3"
