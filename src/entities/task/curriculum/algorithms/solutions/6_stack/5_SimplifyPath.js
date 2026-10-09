const simplifyPath = (path) => {
  const stack = [];

  for (const part of path.split("/")) {
    if (part === "" || part === ".") {
      // Пустой сегмент (двойной слэш) и "." ничего не меняют
      continue;
    }

    if (part === "..") {
      // Подъём на уровень выше; в корне pop() от пустого стека безопасен
      stack.pop();
    } else {
      stack.push(part);
    }
  }

  return "/" + stack.join("/");
};

// Пример вызова:
console.log(simplifyPath("/usr/./local/"));   // "/usr/local"
console.log(simplifyPath("/a//b////c"));      // "/a/b/c"
console.log(simplifyPath("/../../x"));        // "/x"
console.log(simplifyPath("/docs/../tmp/./")); // "/tmp"
console.log(simplifyPath("/.../x/.."));       // "/..."
