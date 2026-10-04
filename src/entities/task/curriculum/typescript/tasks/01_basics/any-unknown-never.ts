// parseJson возвращает any, поэтому ошибка в обращении к полю
// обнаружится только во время выполнения.
//
// 1. Сделайте результат parseJson безопасным: значение должно проверяться
//    перед использованием.
// 2. Типизируйте fail так, чтобы TypeScript понимал: после её вызова
//    выполнение функции не продолжается. Сейчас getUserName не компилируется.

const parseJson = (text: string): any => {
  return JSON.parse(text);
};

const fail = (message: string) => {
  throw new Error(message);
};

const getUserName = (json: string): string => {
  const data = parseJson(json);

  if (data.name) {
    return data.name.toUpperCase();
  }

  fail("В JSON нет поля name");
};

getUserName('{"name": "alice"}');
