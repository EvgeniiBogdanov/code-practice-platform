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
console.log(simplifyPath("/home/"));                // "/home"
console.log(simplifyPath("/home//foo/"));           // "/home/foo"
console.log(simplifyPath("/../"));                  // "/"
console.log(simplifyPath("/a/./b/../../c/"));       // "/c"
console.log(simplifyPath("/.../a/../b/c/../d/./")); // "/.../b/d"
