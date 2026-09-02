const parsePath = (path) => {
  if (Array.isArray(path)) {
    return path;
  }
  if (typeof path !== "string" || path.length === 0) {
    return [];
  }

  // Заменяем скобочную нотацию [0] или ['key'] на .0 или .key, а затем разбиваем по точке
  return path
    .replace(/\[(\w+)\]/g, ".$1")
    .replace(/^\./, "")
    .split(".")
    .filter(Boolean);
};

const get = (obj, path, defaultValue) => {
  if (obj === null || obj === undefined) {
    return defaultValue;
  }

  const keys = parsePath(path);
  if (keys.length === 0) {
    return obj === undefined ? defaultValue : obj;
  }

  let current = obj;
  for (const key of keys) {
    if (current === null || current === undefined) {
      return defaultValue;
    }
    current = current[key];
  }

  return current === undefined ? defaultValue : current;
};

// Пример вызова:
const data = {
  user: {
    posts: [
      { id: 1, title: "Hello World", likes: 10 },
      { id: 2, title: "JavaScript Objects" },
    ],
    settings: {
      theme: "dark",
    },
  },
};

console.log(get(data, "user.posts[0].title"));                       // 'Hello World'
console.log(get(data, ["user", "posts", 0, "likes"]));               // 10
console.log(get(data, "user.posts[1].likes", 0));                    // 0
console.log(get(data, "user.posts[99].title", "Not found"));          // 'Not found'
console.log(get(data, "user.settings.theme.color.primary", "blue")); // 'blue'
console.log(get(null, "a.b.c", "default"));                          // 'default'
