// Безопасное получение значения по пути (get / _.get)
// Напишите функцию get(obj, path, defaultValue), которая извлекает значение из глубоко вложенного объекта по строковому или массивному пути.
//
// Требования:
// 1. Путь может быть передан как строка ('a.b.c', 'a.b[0].c', 'items.0.title') или массив ключей (['a', 'b', 'c']).
// 2. Если значение существует и не равно undefined — возвращает его.
// 3. Если путь не существует или значение равно undefined — возвращает defaultValue.

const get = (obj, path, defaultValue) => {
  // Решение тут
};

// Пример вызова:
const data = {
  user: {
    posts: [
      { id: 1, title: "Hello World", likes: 10 },
      { id: 2, title: "JavaScript Objects" },
    ],
  },
};

console.log(get(data, "user.posts[0].title"));            // 'Hello World'
console.log(get(data, ["user", "posts", 0, "likes"]));    // 10
console.log(get(data, "user.posts[1].likes", 0));         // 0
console.log(get(data, "user.posts[99].title", "Empty"));  // 'Empty'
