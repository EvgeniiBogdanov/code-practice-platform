class TaskQueue {
  constructor() {
    this.queue = Promise.resolve();
  }

  add(taskFn) {
    this.queue = this.queue.then(() => taskFn()).catch((err) => {
      console.error("Ошибка в задаче очереди:", err);
    });
    return this.queue;
  }
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const queue = new TaskQueue();
queue.add(() => delay(300).then(() => console.log("Задача 1")));
queue.add(() => delay(100).then(() => console.log("Задача 2")));
queue.add(() => delay(50).then(() => console.log("Задача 3")));
// Вывод строго по порядку: Задача 1, Задача 2, Задача 3
