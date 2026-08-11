class TaskQueue {
  constructor() {
    this.queue = Promise.resolve();
  }

  add(taskFn) {
    this.queue = this.queue.then(() => taskFn()).catch(console.error);
    return this.queue;
  }
}

// Пример вызова:
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const queue = new TaskQueue();
queue.add(() => delay(100).then(() => console.log("Задача 1")));
queue.add(() => delay(50).then(() => console.log("Задача 2")));
queue.add(() => delay(20).then(() => console.log("Задача 3")));
