// Auto-generated 3-Level Progressive Hints Database for Code Practice Platform
// Generated for all JavaScript tasks (192 tasks)
// Level 1: Идея и ментальная модель (Approach & Conceptual model)
// Level 2: Граничные случаи и ловушки (Edge cases, pitfalls & JS traps)
// Level 3: Псевдокод и сигнатура (Pseudo-code & Structural skeleton)

export const JS_HINTS = {
  "js_while_1": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Цикл while(condition) проверяет условие перед каждой итерацией. Задайте начальное значение счетчика перед циклом и обязательно инкрементируйте его внутри тела."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Не забудьте обновить переменную-счетчик внутри тела, иначе вкладка зависнет из-за бесконечного цикла.\n• Учитывайте случай, когда условие изначально ложно — цикл не выполнится ни разу."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nlet count = 0;\nwhile (count < limit) {\n  console.log(count);\n  count++;\n}\n```"
    }
  },
  "js_while_2": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Для обратного отсчета стартуйте с числа n и на каждом шаге выводите значение, уменьшая счетчик на 1 (n--), пока n >= 1 (или n > 0)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обратите внимание на условие остановки: останавливаемся ровно на 1.\n• При n <= 0 цикл не должен выполнять итераций."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction countdown(n) {\n  while (n >= 1) {\n    console.log(n);\n    n--;\n  }\n}\n```"
    }
  },
  "js_while_3": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Ментальная модель: получение последней цифры числа через остаток от деления на 10 (num % 10) и последующее усечение разряда через целочисленное деление Math.floor(num / 10)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• В JS 123 / 10 дает дробное число 12.3, поэтому строго обязателен Math.floor().\n• Учтите отрицательные числа (Math.abs(num)) и num = 0 (сумма равна 0)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nlet sum = 0;\nlet current = Math.abs(num);\nwhile (current > 0) {\n  sum += current % 10;\n  current = Math.floor(current / 10);\n}\nreturn sum;\n```"
    }
  },
  "js_while_4": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: построение развернутого числа с помощью аккумулятора: на каждом шаге умножаем текущий результат на 10 и прибавляем последнюю цифру входного числа (reversed = reversed * 10 + (num % 10))."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Числа с нулями на конце (например, 980 -> 89): ведущий ноль отбрасывается автоматически.\n• Учтите знак числа через Math.sign(num)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nlet rev = 0;\nlet n = Math.abs(num);\nwhile (n > 0) {\n  rev = rev * 10 + (n % 10);\n  n = Math.floor(n / 10);\n}\nreturn rev * Math.sign(num);\n```"
    }
  },
  "js_while_5": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Алгоритм Евклида: НОД двух чисел a и b равен НОД чисел b и a % b. Повторяйте операцию остатка, пока делитель b !== 0. Когда b станет 0, оставшееся a — и есть НОД."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Порядок аргументов не важен: если a < b, то первая же итерация a % b поменяет их местами.\n• Оберните числа в Math.abs() для отрицательных значений."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction gcd(a, b) {\n  a = Math.abs(a);\n  b = Math.abs(b);\n  while (b !== 0) {\n    const temp = b;\n    b = a % b;\n    a = temp;\n  }\n  return a;\n}\n```"
    }
  },
  "js_while_6": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Бинарный поиск работает только на отсортированном массиве за O(log N). Держите два указателя left = 0 и right = arr.length - 1. На каждом шаге находите середину mid = Math.floor((left + right) / 2) и отсекайте половину поиска."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Условие цикла: while (left <= right) (строго с <=, иначе пропустите массив из 1 элемента).\n• При сужении границ обязательно делайте left = mid + 1 или right = mid - 1, иначе возможен бесконечный цикл."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nlet left = 0, right = arr.length - 1;\nwhile (left <= right) {\n  const mid = Math.floor((left + right) / 2);\n  if (arr[mid] === target) return mid;\n  if (arr[mid] < target) left = mid + 1;\n  else right = mid - 1;\n}\nreturn -1;\n```"
    }
  },
  "js_while_7": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Для обхода связного списка заведите указатель на текущий узел current = head. В цикле while (current !== null) накапливайте сумму current.val и переходите к следующему узлу: current = current.next."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Пустой список (head === null): функция должна вернуть 0 и не падать с ошибкой.\n• Если список содержит цикл, простой while зациклится (на интервью могут спросить про защиту через Set)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nlet current = head;\nlet sum = 0;\nwhile (current !== null) {\n  sum += current.val;\n  current = current.next;\n}\nreturn sum;\n```"
    }
  },
  "js_while_8": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Используйте паттерн двух указателей: i = 0 для первого массива, j = 0 для второго. Сравнивайте arr1[i] и arr2[j], меньший элемент пушьте в результат и инкрементируйте указатель."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• После окончания одного из массивов оставшиеся элементы второго массива нужно дописать в конец.\n• Не используйте arr1.concat(arr2).sort() — интервьюер ждет оптимальное решение за O(N + M)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst result = [];\nlet i = 0, j = 0;\nwhile (i < arr1.length && j < arr2.length) {\n  if (arr1[i] <= arr2[j]) result.push(arr1[i++]);\n  else result.push(arr2[j++]);\n}\nwhile (i < arr1.length) result.push(arr1[i++]);\nwhile (j < arr2.length) result.push(arr2[j++]);\nreturn result;\n```"
    }
  },
  "js1": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Классический цикл for (инициализация; условие; шаг) состоит из 3 секций. Создайте локальную переменную через let i = 0, задайте условие i < limit и шаг i++."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно используйте let, а не var, чтобы переменная счетчика имела блочную область видимости.\n• Будьте внимательны со строгим < и нестрогим <= сравнением."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfor (let i = 0; i < 5; i++) {\n  console.log(i);\n}\n```"
    }
  },
  "js2": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Для диапазона от 1 до N инициализируйте счетчик let i = 1 и продолжайте до i <= n включительно."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Если n < 1, цикл не должен совершать лишних итераций.\n• Не забывайте, что последнее число — n, поэтому условие строго i <= n."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction printNumbers(n) {\n  for (let i = 1; i <= n; i++) {\n    console.log(i);\n  }\n}\n```"
    }
  },
  "js3": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Заведите переменную-аккумулятор let sum = 0 перед циклом. В цикле от 1 до n прибавляйте текущее i к аккумулятору: sum += i."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Учтите случай n = 0 (сумма 0).\n• На интервью могут спросить формулу за O(1): n * (n + 1) / 2."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nlet sum = 0;\nfor (let i = 1; i <= n; i++) {\n  sum += i;\n}\nreturn sum;\n```"
    }
  },
  "js4": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Для четных чисел начните с 2 и шагайте с шагом 2: for (let i = 2; i <= n; i += 2)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Шаг i += 2 вдвое эффективнее по количеству итераций, чем проверка i % 2 === 0 на каждом числе.\n• Проверьте случай, когда n < 2."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfor (let i = 2; i <= n; i += 2) {\n  console.log(i);\n}\n```"
    }
  },
  "js5": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Паттерн двух указателей: идите от начала i = 0 и от конца j = str.length - 1 - i к середине строки (i < str.length / 2). Если символы str[i] !== str[j], строка не палиндром."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Регистр и спецсимволы: при необходимости примените .toLowerCase().\n• Решение с двумя указателями за O(N) времени и O(1) памяти эффективнее создания промежуточных массивов."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst len = str.length;\nfor (let i = 0; i < len / 2; i++) {\n  if (str[i] !== str[len - 1 - i]) {\n    return false;\n  }\n}\nreturn true;\n```"
    }
  },
  "js6": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Инициализируйте аккумулятор let sum = 0 и пройдитесь по всем индексам массива от 0 до arr.length - 1, прибавляя arr[i]."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Пустой массив []: сумма должна быть 0.\n• Массив с отрицательными числами или нулями корректно обрабатывается стандартным сложением."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nlet sum = 0;\nfor (let i = 0; i < arr.length; i++) {\n  sum += arr[i];\n}\nreturn sum;\n```"
    }
  },
  "js7": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Пузырьковая сортировка сравнивает соседние элементы arr[j] и arr[j + 1] и меняет их местами, если они стоят не по порядку. Самый большой элемент 'всплывает' в конец на каждом внешнем проходе."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Оптимизация: внешний цикл уменьшает диапазон внутреннего на i (j < n - 1 - i).\n• Флаг swapped: если за весь внутренний проход не было перестановок, массив уже отсортирован — можно прервать цикл break."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst n = arr.length;\nfor (let i = 0; i < n - 1; i++) {\n  let swapped = false;\n  for (let j = 0; j < n - 1 - i; j++) {\n    if (arr[j] > arr[j + 1]) {\n      [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n      swapped = true;\n    }\n  }\n  if (!swapped) break;\n}\nreturn arr;\n```"
    }
  },
  "js8": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Цикл for (const item of iterable) работает с любыми итерируемыми объектами (Array, Set, Map, String) по протоколу [Symbol.iterator], возвращая напрямую значения элементов."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• for...of не работает с обычными объектами {} (для них нужен for...in или Object.entries()).\n• Внутри for...of можно безопасно использовать break, continue и return."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfor (const item of arr) {\n  console.log(item);\n}\n```"
    }
  },
  "js9": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "В цикле for...of вы получаете само число num на каждой итерации, минуя обращение по индексу arr[i]. Накапливайте сумму в переменной sum += num."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Инициализируйте sum = 0 перед циклом.\n• Для пустого массива цикл не выполнится и вернет 0."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nlet sum = 0;\nfor (const num of arr) {\n  sum += num;\n}\nreturn sum;\n```"
    }
  },
  "js10": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Инициализируйте максимум первым элементом массива: let max = arr[0]. Пройдитесь по всем числам через for...of и обновляйте максимум, если текущее число больше: if (num > max) max = num."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Не инициализируйте max = 0, так как массив может состоять только из отрицательных чисел ([-5, -10, -2] -> максимум -2).\n• Для пустого массива верните undefined."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nif (arr.length === 0) return undefined;\nlet max = arr[0];\nfor (const num of arr) {\n  if (num > max) max = num;\n}\nreturn max;\n```"
    }
  },
  "js11": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Цикл for (const key in obj) итерирует строковые имена всех перечисляемых (enumerable) свойств объекта, включая свойства из цепочки прототипов."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Ловушка прототипов: чтобы отфильтровать унаследованные свойства, используйте Object.hasOwn(obj, key) или obj.hasOwnProperty(key).\n• for...in не гарантирует строгий порядок числовых ключей."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfor (const key in obj) {\n  if (Object.hasOwn(obj, key)) {\n    console.log(key, obj[key]);\n  }\n}\n```"
    }
  },
  "js12": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Заведите счетчик let count = 0 и инкрементируйте его в цикле for...in для каждого собственного свойства объекта."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Убедитесь, что отфильтровали унаследованные свойства через Object.hasOwn(obj, key).\n• На собеседовании упомяните современный эквивалент за O(N): Object.keys(obj).length."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nlet count = 0;\nfor (const key in obj) {\n  if (Object.hasOwn(obj, key)) count++;\n}\nreturn count;\n```"
    }
  },
  "js13": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Итерируйте свойства объекта через for...in и проверяйте тип каждого значения: typeof obj[key] === 'number' и !Number.isNaN(obj[key]), прибавляя к сумме."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• В объекте могут быть вложенные структуры, строки, null или NaN. Проверяйте Number.isFinite(val).\n• Проверяйте Object.hasOwn(obj, key) для исключения прототипных свойств."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nlet sum = 0;\nfor (const key in obj) {\n  if (Object.hasOwn(obj, key) && typeof obj[key] === 'number' && !Number.isNaN(obj[key])) {\n    sum += obj[key];\n  }\n}\nreturn sum;\n```"
    }
  },
  "js14": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Метод Array.prototype.map() возвращает новый массив той же длины, где каждый элемент трансформирован переданной чистой функцией без мутации исходного массива."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• map всегда возвращает массив ровно той же длины. Не используйте его для фильтрации.\n• Не забывайте возвращать результат из колбэка (x => x * 2)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst doubled = numbers.map(num => num * 2);\n```"
    }
  },
  "js15": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Метод Array.prototype.filter() создает новый массив, содержащий только те элементы, для которых колбэк вернул истинное (truthy) значение."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Для проверки четности используйте num % 2 === 0.\n• filter не мутирует исходный массив и при отсутствии совпадений возвращает пустой массив []."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst evens = numbers.filter(num => num % 2 === 0);\n```"
    }
  },
  "js16": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Метод Array.prototype.reduce() последовательно сворачивает элементы массива в единое аккумулирующее значение: arr.reduce((acc, curr) => acc + curr, initialValue)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Всегда явно передавайте начальное значение initialValue (например, 0 для суммы), иначе при пустом массиве reduce выбросит TypeError: Reduce of empty array with no initial value."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst total = numbers.reduce((acc, curr) => acc + curr, 0);\n```"
    }
  },
  "js17": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Метод Array.prototype.find() возвращает значение первого элемента массива, удовлетворяющего предикату. Поиск прекращается сразу при первом совпадении."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Если ни один элемент не удовлетворяет условию, find() возвращает undefined.\n• В отличие от filter(), который просматривает весь массив, find() работает с ранним выходом."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst found = arr.find(item => item.id === targetId);\n```"
    }
  },
  "js18": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Метод Array.prototype.some() возвращает true, если хотя бы один элемент удовлетворяет условию, и false в противном случае. Прерывает обход на первом совпадении."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Для пустого массива [].some(...) всегда возвращает false независимо от условия.\n• Для поиска отрицательного числа проверяйте num < 0."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst hasNegative = numbers.some(num => num < 0);\n```"
    }
  },
  "js19": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Метод Array.prototype.every() возвращает true, если ВСЕ элементы массива удовлетворяют условию предиката. Прерывает обход при первом встреченном false."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Внимание: для пустого массива [].every(...) по спецификации всегда возвращает true (вакуумная истина).\n• Проверяйте num > 0 для положительных чисел."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst allPositive = numbers.every(num => num > 0);\n```"
    }
  },
  "js20": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Метод Array.prototype.flat(depth) возвращает новый массив со 'сплющенными' подмассивами до указанной глубины (по умолчанию depth = 1, для бесконечной глубины — Infinity)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• flat() также автоматически удаляет пустые слоты (дыры) в разреженных массивах.\n• Не мутирует исходный массив."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst flattened = nestedArray.flat(Infinity);\n```"
    }
  },
  "js21": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Метод Array.prototype.flatMap() совмещает вызов .map() и последующий .flat(1). Он эффективнее, чем последовательный вызов двух методов, так как не создает промежуточный массив."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Позволяет возвращать массив из колбэка для размножения или удаления элементов (возврат [] удаляет элемент, возврат [a, b] разворачивает два элемента).\n• Глубина уплощения строго равна 1."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst words = sentences.flatMap(s => s.split(' '));\n```"
    }
  },
  "js22": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Разница: slice(start, end) возвращает поверхностную копию среза без мутации; splice(start, deleteCount, ...items) вырезает элементы и МУТИРУЕТ исходный массив."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• slice() не включает элемент по индексу end.\n• splice() возвращает массив удаленных элементов и меняет length исходного массива."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\n// Немутирующая копия части:\nconst chunk = arr.slice(1, 3);\n// Мутирующее удаление/вставка:\nconst removed = arr.splice(1, 2, 'newItem');\n```"
    }
  },
  "js23": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Метод includes(val) проверяет наличие значения (возвращает true/false), а indexOf(val) возвращает первый индекс или -1."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Разница с NaN: [NaN].includes(NaN) вернет true (алгоритм SameValueZero), тогда как [NaN].indexOf(NaN) вернет -1 (так как NaN === NaN ложно)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst exists = arr.includes(target);\nconst index = arr.indexOf(target);\n```"
    }
  },
  "js24": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Используйте цикл с шагом size (for let i = 0; i < arr.length; i += size) и метод arr.slice(i, i + size) для извлечения каждого чанка."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Проверьте случай, когда длина массива не делится нацело на size (последний чанк будет короче).\n• Если size <= 0 или массив пуст, верните []."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst result = [];\nfor (let i = 0; i < arr.length; i += size) {\n  result.push(arr.slice(i, i + size));\n}\nreturn result;\n```"
    }
  },
  "js25": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Самый идиоматичный способ в современном JS — обернуть массив в Set: Array.from(new Set(arr)) или [...new Set(arr)]."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Для примитивов Set работает за O(N) времени.\n• Если массив содержит объекты, помните, что Set сравнивает объекты по ссылке, а не по содержимому."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction unique(arr) {\n  return [...new Set(arr)];\n}\n```"
    }
  },
  "js26": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Преобразуйте один из массивов в Set (const setB = new Set(arr2)) для O(1) поиска, затем отфильтруйте первый массив через arr1.filter(x => setB.has(x))."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно делайте Set перед фильтрацией, иначе arr2.includes(x) даст O(N * M) вместо O(N + M).\n• Если в результате не должно быть дубликатов, оберните итоговый массив в new Set()."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst setB = new Set(arr2);\nreturn [...new Set(arr1.filter(item => setB.has(item)))];\n```"
    }
  },
  "js27": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Поместите элементы второго массива в Set (const excluded = new Set(arr2)) и отфильтруйте первый массив: arr1.filter(x => !excluded.has(x))."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Порядок вычитания важен: difference(A, B) !== difference(B, A).\n• Проверьте пустые массивы."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst set2 = new Set(arr2);\nreturn arr1.filter(x => !set2.has(x));\n```"
    }
  },
  "js28": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Алгоритм тасования Фишера-Йетса (Fisher-Yates Shuffle): идите от конца массива к началу (for let i = arr.length - 1; i > 0; i--), выбирайте случайный индекс j от 0 до i и меняйте местами arr[i] и arr[j]."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Не используйте arr.sort(() => Math.random() - 0.5) — этот способ математически нечестный (дает неравномерное распределение вероятностей) и медленный.\n• Не мутируйте исходный массив, если требуется чистая функция: создайте копию [...arr]."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst result = [...arr];\nfor (let i = result.length - 1; i > 0; i--) {\n  const j = Math.floor(Math.random() * (i + 1));\n  [result[i], result[j]] = [result[j], result[i]];\n}\nreturn result;\n```"
    }
  },
  "js29": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Разворот массива без мутации: создайте копию и примените метод toReversed() (ES2023) или [...arr].reverse(). Либо соберите новый массив в обратном цикле."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Метод arr.reverse() мутирует исходный массив на месте, что является частым антипаттерном на интервью.\n• Для старых окружений: arr.slice().reverse()."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nreturn arr.slice().reverse(); // или arr.toReversed()\n```"
    }
  },
  "js30": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Функция compact удаляет все falsy-значения (false, null, 0, '', undefined, NaN). Достаточно применить arr.filter(Boolean)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Передача функции-конструктора Boolean в качестве колбэка filter эквивалентна item => Boolean(item).\n• Убедитесь, что 0 и '' корректно отфильтровываются как ложные значения."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction compact(arr) {\n  return arr.filter(Boolean);\n}\n```"
    }
  },
  "js31": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Для глубокого сплющивания массива произвольной вложенности используйте рекурсию с reduce: если элемент массив — рекурсивно сплющивайте его, иначе пушьте в аккумулятор."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• В современном JS доступен arr.flat(Infinity), но на интервью часто просят написать свою реализацию.\n• Для защиты от переполнения стека в цикле можно использовать стек (stack-based iterative approach)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction flattenDeep(arr) {\n  return arr.reduce((acc, val) =>\n    Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val)\n  , []);\n}\n```"
    }
  },
  "js32": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Функция zip(arr1, arr2, ...) группирует элементы нескольких массивов с одинаковыми индексами. Найдите максимальную длину среди массивов и сформируйте кортежи."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Если массивы разной длины, недостающие элементы заполняются undefined.\n• Используйте Math.max(...arrays.map(a => a.length)) для определения количества групп."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction zip(...arrays) {\n  const maxLen = Math.max(...arrays.map(a => a.length));\n  return Array.from({ length: maxLen }, (_, i) => arrays.map(a => a[i]));\n}\n```"
    }
  },
  "js33": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Unzip обратна к zip: принимает массив кортежей [[1, 'a'], [2, 'b']] и возвращает [[1, 2], ['a', 'b']]. Примените zip(...matrix)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Пустая матрица [] должна возвращать [].\n• Убедитесь, что количество результирующих массивов равно длине первого кортежа."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction unzip(matrix) {\n  if (!matrix.length) return [];\n  return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));\n}\n```"
    }
  },
  "js34": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Сверните массив через reduce (или for...of). Вычисляйте ключ для каждого элемента (через функцию fn(item) или свойство item[key]), создавайте пустой массив acc[k] = acc[k] || [] и пушьте элемент."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Поддерживайте как функцию-селектор (x => x.role), так и строковый ключ ('role').\n• На интервью упомяните современный Object.groupBy(arr, fn) (ES2024)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nreturn arr.reduce((acc, item) => {\n  const key = typeof iteratee === 'function' ? iteratee(item) : item[iteratee];\n  (acc[key] = acc[key] || []).push(item);\n  return acc;\n}, {});\n```"
    }
  },
  "js35": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Аналогично groupBy, но вместо массива элементов сохраняйте число: acc[key] = (acc[key] || 0) + 1."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обратите внимание: для первого появления ключа значение (acc[key] || 0) даст 0 + 1 = 1.\n• Ключи в JS-объектах всегда строковые."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nreturn arr.reduce((acc, item) => {\n  const key = typeof fn === 'function' ? fn(item) : item[fn];\n  acc[key] = (acc[key] || 0) + 1;\n  return acc;\n}, {});\n```"
    }
  },
  "js36": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Используйте reduce с начальным значением 0. Извлекайте числовое свойство через fn(item) или item[key] и прибавляйте к аккумулятору."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обрабатывайте отсутствие свойства или нечисловые значения (NaN, undefined) через Number(val) || 0.\n• Начальное значение 0 строго обязательно."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nreturn arr.reduce((sum, item) => {\n  const val = typeof iteratee === 'function' ? iteratee(item) : item[iteratee];\n  return sum + (Number(val) || 0);\n}, 0);\n```"
    }
  },
  "js37": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Пройдитесь по массиву за один проход O(N). Инициализируйте min = arr[0] и max = arr[0] и на каждом шаге обновляйте оба значения."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Для пустого массива верните { min: undefined, max: undefined }.\n• Один проход эффективнее раздельных Math.min(...arr) и Math.max(...arr), которые к тому же могут вызвать переполнение стека аргументов на больших массивах."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nif (!arr.length) return { min: undefined, max: undefined };\nlet min = arr[0], max = arr[0];\nfor (let i = 1; i < arr.length; i++) {\n  if (arr[i] < min) min = arr[i];\n  if (arr[i] > max) max = arr[i];\n}\nreturn { min, max };\n```"
    }
  },
  "js38": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Трансформация массива объектов в словарь (хэш-мапу) по уникальному ключу: acc[item[key]] = item. Предоставляет доступ к сущностям за O(1)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Если в массиве есть элементы с одинаковым ключом, последующий элемент перезапишет предыдущий.\n• Ключом может быть как строка, так и функция-селектор."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nreturn arr.reduce((acc, item) => {\n  const k = typeof key === 'function' ? key(item) : item[key];\n  acc[k] = item;\n  return acc;\n}, {});\n```"
    }
  },
  "js39": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Разделение массива на две корзины [pass, fail] на основе предиката: элементы, для которых predicate(item) === true, идут в pass, остальные — в fail."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Возвращается массив из двух подмассивов: [[...pass], [...fail]].\n• Реализуйте за один проход через reduce или for...of."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst pass = [], fail = [];\nfor (const item of arr) {\n  if (predicate(item)) pass.push(item);\n  else fail.push(item);\n}\nreturn [pass, fail];\n```"
    }
  },
  "js41": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Среднее арифметическое = (сумма всех элементов) / (количество элементов). Найдите сумму через reduce и разделите на arr.length."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Защититесь от деления на 0 при пустом массиве: верните 0 или NaN.\n• Убедитесь, что все элементы приведены к числам."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nif (!arr.length) return 0;\nconst sum = arr.reduce((acc, n) => acc + Number(n), 0);\nreturn sum / arr.length;\n```"
    }
  },
  "js42": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Поиск объекта с минимальным критерием. Храните лучший объект и его вычисленное значение. Сравнивайте каждый элемент с текущим минимумом."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Не вызывайте тяжелую функцию-селектор повторно для уже найденного минимума: закэшируйте minVal.\n• Для пустого массива верните undefined."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nif (!arr.length) return undefined;\nlet best = arr[0], minVal = fn(arr[0]);\nfor (let i = 1; i < arr.length; i++) {\n  const val = fn(arr[i]);\n  if (val < minVal) { best = arr[i]; minVal = val; }\n}\nreturn best;\n```"
    }
  },
  "js43": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Метод map() всегда возвращает новый массив той же длины, что и исходный. Колбэк вызывается для каждого элемента."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Если условие if (num % 2 === 0) не выполняется, явного return нет, и функция по умолчанию возвращает undefined.\n• map() не фильтрует массив, а заменяет элементы результатами вызова колбэка."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\n// arr = [1, 2, 3]\n// 1 -> num % 2 === 0 (false) -> undefined\n// 2 -> num % 2 === 0 (true)  -> return 2\n// 3 -> num % 2 === 0 (false) -> undefined\n// Итог: [undefined, 2, undefined]\n```"
    }
  },
  "js44": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Метод sort() в JS по умолчанию сортирует элементы как строки в лексикографическом порядке ('10' идет раньше '2'). Для чисел обязательно передавайте компаратор: (a, b) => a - b."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Метод arr.sort() МУТИРУЕТ массив. Если нужна копия: [...arr].sort((a, b) => a - b) или arr.toSorted((a, b) => a - b).\n• Если a - b < 0, a ставится перед b."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nreturn [...arr].sort((a, b) => a - b);\n```"
    }
  },
  "js45": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Для сортировки чисел по убыванию компаратор должен возвращать (b - a): если b больше a, результат положителен, и b перемещается вперед."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Следите за иммутабельностью: делайте копию перед вызовом .sort().\n• Компаратор должен возвращать число (отрицательное, ноль или положительное)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nreturn [...arr].sort((a, b) => b - a);\n```"
    }
  },
  "js46": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Для сортировки строк в обратном алфавитном порядке скомбинируйте методы sort() и reverse(): сначала отсортируйте массив по алфавиту, а затем разверните его."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Методы .sort() и .reverse() мутируют исходный массив на месте (in-place).\n• В современном стандарте ES2023 для иммутабельной сортировки можно использовать arr.toSorted().toReversed() или предварительно сделать копию массива."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nreturn words.sort().reverse();\n```"
    }
  },
  "js47": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Кастомный компаратор comparator(a, b) возвращает < 0 (a перед b), 0 (равны), > 0 (b перед a)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Компаратор должен быть транзитивным: если A < B и B < C, то A должно быть < C.\n• Не возвращайте boolean (true/false) из компаратора — это частая ошибка, ломающая сортировку в движках V8."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nreturn [...arr].sort(comparator);\n```"
    }
  },
  "js48": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Стабильная сортировка (Stable Sort) гарантирует сохранение исходного относительного порядка элементов с одинаковыми ключами сравнения."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Начиная с ECMAScript 2019 (V8 7.0+ / TimSort), Array.prototype.sort в JS гарантированно стабилен.\n• Если требуется вручную обеспечить стабильность в старых движках: сохраняйте исходный индекс каждого элемента ({ item, index }) и используйте его как тай-брейкер."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nreturn arr.map((item, index) => ({ item, index }))\n  .sort((a, b) => compare(a.item, b.item) || (a.index - b.index))\n  .map(wrapper => wrapper.item);\n```"
    }
  },
  "js49": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Разделите массив на две группы с помощью filter: чётные (x % 2 === 0) и нечётные (x % 2 !== 0). Отсортируйте каждую группу по возрастанию через .sort((a, b) => a - b) и объедините результат: [...evens, ...odds]."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Для отбора нечётных чисел используйте проверку x % 2 !== 0, так как для отрицательных нечётных чисел (например, -1) остаток равен -1, а не 1.\n• Метод filter возвращает новый массив, поэтому последующий .sort() не мутирует исходный массив."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst evens = arr.filter(x => x % 2 === 0).sort((a, b) => a - b);\nconst odds = arr.filter(x => x % 2 !== 0).sort((a, b) => a - b);\nreturn [...evens, ...odds];\n```"
    }
  },
  "js50": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Вызов sort() без компаратора приводит все элементы к строкам и сравнивает их по кодам символов Unicode (лексикографический порядок)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Числа '1' и '100' начинаются с символа '1', поэтому идут перед '21', '30' и '4'.\n• Метод sort() мутирует исходный массив на месте."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\n// Вывод:\n// [1, 100, 21, 30, 4]\n```"
    }
  },
  "js51": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Метод reduce() принимает функцию-колбэк и начальное значение (initialValue). Колбэк принимает аккумулятор (acc) и текущий элемент (item)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Не забывайте возвращать обновлённый аккумулятор (return acc) из тела функции на каждом шаге.\n• Всегда передавайте initialValue вторым аргументом в reduce()."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\narr.reduce((acc, item) => {\n  return acc;\n}, initialValue);\n```"
    }
  },
  "js52": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "FindIndex перебирает массив и возвращает индекс первого элемента, для которого predicate(arr[i], i, arr) вернул true."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Если совпадений нет, возвращается строго -1 (в отличие от find(), который возвращает undefined).\n• Ранний выход break при первом совпадении."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfor (let i = 0; i < arr.length; i++) {\n  if (predicate(arr[i], i, arr)) return i;\n}\nreturn -1;\n```"
    }
  },
  "js53": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Поиск последнего элемента (findLast / findLastIndex): начните обход массива с конца (let i = arr.length - 1; i >= 0; i--) к началу."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обход с конца находит последний подходящий элемент за первый же шаг без необходимости обходить весь массив.\n• В ES2023 добавлены нативные методы arr.findLast() и arr.findLastIndex()."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfor (let i = arr.length - 1; i >= 0; i--) {\n  if (predicate(arr[i], i, arr)) return arr[i]; // или return i для индекса\n}\nreturn undefined;\n```"
    }
  },
  "js54": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Кастомный поиск с предикатом возвращает элемент или индекс по переданной функции-условию."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Передавайте в предикат 3 аргумента по стандарту JS: predicate(item, index, array).\n• Убедитесь, что предикат вызывается с правильным контекстом."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfor (let i = 0; i < arr.length; i++) {\n  if (predicate(arr[i], i, arr)) return arr[i];\n}\nreturn undefined;\n```"
    }
  },
  "js55": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Поиск первого и последнего вхождения элемента в отсортированном массиве за O(log N): выполните два модифицированных бинарных поиска (один ищет левую границу, второй — правую)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• При нахождении arr[mid] === target для левой границы продолжайте поиск влево (right = mid - 1), для правой — вправо (left = mid + 1).\n• Если элемент отсутствует, верните [-1, -1]."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction findBound(isFirst) {\n  let l = 0, r = arr.length - 1, ans = -1;\n  while (l <= r) {\n    const mid = (l + r) >> 1;\n    if (arr[mid] === target) {\n      ans = mid;\n      if (isFirst) r = mid - 1; else l = mid + 1;\n    } else if (arr[mid] < target) l = mid + 1;\n    else r = mid - 1;\n  }\n  return ans;\n}\nreturn [findBound(true), findBound(false)];\n```"
    }
  },
  "js56": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Ментальная модель для «6. Базовый расчет корзины»: разбейте задачу на шаги, определите входные и выходные типы данных и выделите ключевой алгоритм или механизм JavaScript (Массивы)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обратите внимание на крайние случаи: пустые структуры данных, передачу null/undefined, неверные типы аргументов и очистку ресурсов.\n• Убедитесь в отсутствии нежелательных мутаций и утечек памяти."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\n// Сигнатура функции:\nfunction solution(...args) {\n  // 1. Валидация входных данных\n  // 2. Основная логика\n  // 3. Возврат результата\n}\n```"
    }
  },
  "js57": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Ментальная модель для «7. Минимум и максимум»: разбейте задачу на шаги, определите входные и выходные типы данных и выделите ключевой алгоритм или механизм JavaScript (Массивы)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обратите внимание на крайние случаи: пустые структуры данных, передачу null/undefined, неверные типы аргументов и очистку ресурсов.\n• Убедитесь в отсутствии нежелательных мутаций и утечек памяти."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\n// Сигнатура функции:\nfunction solution(...args) {\n  // 1. Валидация входных данных\n  // 2. Основная логика\n  // 3. Возврат результата\n}\n```"
    }
  },
  "js58": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Ментальная модель для «8. Flatten (Разглаживание)»: разбейте задачу на шаги, определите входные и выходные типы данных и выделите ключевой алгоритм или механизм JavaScript (Массивы)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обратите внимание на крайние случаи: пустые структуры данных, передачу null/undefined, неверные типы аргументов и очистку ресурсов.\n• Убедитесь в отсутствии нежелательных мутаций и утечек памяти."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\n// Сигнатура функции:\nfunction solution(...args) {\n  // 1. Валидация входных данных\n  // 2. Основная логика\n  // 3. Возврат результата\n}\n```"
    }
  },
  "js59": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Ментальная модель для «9. Группировка по свойству»: разбейте задачу на шаги, определите входные и выходные типы данных и выделите ключевой алгоритм или механизм JavaScript (Массивы)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обратите внимание на крайние случаи: пустые структуры данных, передачу null/undefined, неверные типы аргументов и очистку ресурсов.\n• Убедитесь в отсутствии нежелательных мутаций и утечек памяти."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\n// Сигнатура функции:\nfunction solution(...args) {\n  // 1. Валидация входных данных\n  // 2. Основная логика\n  // 3. Возврат результата\n}\n```"
    }
  },
  "js60": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Ментальная модель для «10. Группировка с сортировкой внутри»: разбейте задачу на шаги, определите входные и выходные типы данных и выделите ключевой алгоритм или механизм JavaScript (Массивы)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обратите внимание на крайние случаи: пустые структуры данных, передачу null/undefined, неверные типы аргументов и очистку ресурсов.\n• Убедитесь в отсутствии нежелательных мутаций и утечек памяти."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\n// Сигнатура функции:\nfunction solution(...args) {\n  // 1. Валидация входных данных\n  // 2. Основная логика\n  // 3. Возврат результата\n}\n```"
    }
  },
  "js61": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Ментальная модель для «11. Уникальные значения»: разбейте задачу на шаги, определите входные и выходные типы данных и выделите ключевой алгоритм или механизм JavaScript (Массивы)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обратите внимание на крайние случаи: пустые структуры данных, передачу null/undefined, неверные типы аргументов и очистку ресурсов.\n• Убедитесь в отсутствии нежелательных мутаций и утечек памяти."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\n// Сигнатура функции:\nfunction solution(...args) {\n  // 1. Валидация входных данных\n  // 2. Основная логика\n  // 3. Возврат результата\n}\n```"
    }
  },
  "js62": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Ментальная модель для «12. Индексирование (эмуляция Map через reduce)»: разбейте задачу на шаги, определите входные и выходные типы данных и выделите ключевой алгоритм или механизм JavaScript (Массивы)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обратите внимание на крайние случаи: пустые структуры данных, передачу null/undefined, неверные типы аргументов и очистку ресурсов.\n• Убедитесь в отсутствии нежелательных мутаций и утечек памяти."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\n// Сигнатура функции:\nfunction solution(...args) {\n  // 1. Валидация входных данных\n  // 2. Основная логика\n  // 3. Возврат результата\n}\n```"
    }
  },
  "js63": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Ментальная модель для «13. Среднее арифметическое (Агрегация)»: разбейте задачу на шаги, определите входные и выходные типы данных и выделите ключевой алгоритм или механизм JavaScript (Массивы)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обратите внимание на крайние случаи: пустые структуры данных, передачу null/undefined, неверные типы аргументов и очистку ресурсов.\n• Убедитесь в отсутствии нежелательных мутаций и утечек памяти."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\n// Сигнатура функции:\nfunction solution(...args) {\n  // 1. Валидация входных данных\n  // 2. Основная логика\n  // 3. Возврат результата\n}\n```"
    }
  },
  "js64": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Ментальная модель для «14. Создать объект»: разбейте задачу на шаги, определите входные и выходные типы данных и выделите ключевой алгоритм или механизм JavaScript (Массивы)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обратите внимание на крайние случаи: пустые структуры данных, передачу null/undefined, неверные типы аргументов и очистку ресурсов.\n• Убедитесь в отсутствии нежелательных мутаций и утечек памяти."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\n// Сигнатура функции:\nfunction solution(...args) {\n  // 1. Валидация входных данных\n  // 2. Основная логика\n  // 3. Возврат результата\n}\n```"
    }
  },
  "js65": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Ментальная модель для «15. Merge объектов с суммированием значений (Сложный)»: разбейте задачу на шаги, определите входные и выходные типы данных и выделите ключевой алгоритм или механизм JavaScript (Массивы)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обратите внимание на крайние случаи: пустые структуры данных, передачу null/undefined, неверные типы аргументов и очистку ресурсов.\n• Убедитесь в отсутствии нежелательных мутаций и утечек памяти."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\n// Сигнатура функции:\nfunction solution(...args) {\n  // 1. Валидация входных данных\n  // 2. Основная логика\n  // 3. Возврат результата\n}\n```"
    }
  },
  "js66": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Ментальная модель для «16. Группировка названий продуктов по категории»: разбейте задачу на шаги, определите входные и выходные типы данных и выделите ключевой алгоритм или механизм JavaScript (Массивы)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обратите внимание на крайние случаи: пустые структуры данных, передачу null/undefined, неверные типы аргументов и очистку ресурсов.\n• Убедитесь в отсутствии нежелательных мутаций и утечек памяти."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\n// Сигнатура функции:\nfunction solution(...args) {\n  // 1. Валидация входных данных\n  // 2. Основная логика\n  // 3. Возврат результата\n}\n```"
    }
  },
  "js67": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Ментальная модель для «17. Группировка по country и id (Company X)»: разбейте задачу на шаги, определите входные и выходные типы данных и выделите ключевой алгоритм или механизм JavaScript (Массивы)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обратите внимание на крайние случаи: пустые структуры данных, передачу null/undefined, неверные типы аргументов и очистку ресурсов.\n• Убедитесь в отсутствии нежелательных мутаций и утечек памяти."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\n// Сигнатура функции:\nfunction solution(...args) {\n  // 1. Валидация входных данных\n  // 2. Основная логика\n  // 3. Возврат результата\n}\n```"
    }
  },
  "js68": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Ментальная модель для «18. Что вернёт этот код ?»: разбейте задачу на шаги, определите входные и выходные типы данных и выделите ключевой алгоритм или механизм JavaScript (Массивы)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обратите внимание на крайние случаи: пустые структуры данных, передачу null/undefined, неверные типы аргументов и очистку ресурсов.\n• Убедитесь в отсутствии нежелательных мутаций и утечек памяти."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\n// Сигнатура функции:\nfunction solution(...args) {\n  // 1. Валидация входных данных\n  // 2. Основная логика\n  // 3. Возврат результата\n}\n```"
    }
  },
  "js69": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронными таймерами браузера (macrotasks в Event Loop). Сохраняйте идентификатор таймера (timerId = setTimeout/setInterval) для возможности его отмены через clearTimeout/clearInterval."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно очищайте таймеры при уничтожении/отмене, чтобы предотвратить утечки памяти.\n• Помните, что задержка в setTimeout/setInterval не гарантирует точное время выполнения, а задает лишь минимальную задержку."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst timerId = setTimeout(() => {\n  fn();\n}, delay);\n// Отмена:\nclearTimeout(timerId);\n```"
    }
  },
  "js70": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронными таймерами браузера (macrotasks в Event Loop). Сохраняйте идентификатор таймера (timerId = setTimeout/setInterval) для возможности его отмены через clearTimeout/clearInterval."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно очищайте таймеры при уничтожении/отмене, чтобы предотвратить утечки памяти.\n• Помните, что задержка в setTimeout/setInterval не гарантирует точное время выполнения, а задает лишь минимальную задержку."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst timerId = setTimeout(() => {\n  fn();\n}, delay);\n// Отмена:\nclearTimeout(timerId);\n```"
    }
  },
  "js71": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронными таймерами браузера (macrotasks в Event Loop). Сохраняйте идентификатор таймера (timerId = setTimeout/setInterval) для возможности его отмены через clearTimeout/clearInterval."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно очищайте таймеры при уничтожении/отмене, чтобы предотвратить утечки памяти.\n• Помните, что задержка в setTimeout/setInterval не гарантирует точное время выполнения, а задает лишь минимальную задержку."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst timerId = setTimeout(() => {\n  fn();\n}, delay);\n// Отмена:\nclearTimeout(timerId);\n```"
    }
  },
  "js72": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронными таймерами браузера (macrotasks в Event Loop). Сохраняйте идентификатор таймера (timerId = setTimeout/setInterval) для возможности его отмены через clearTimeout/clearInterval."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно очищайте таймеры при уничтожении/отмене, чтобы предотвратить утечки памяти.\n• Помните, что задержка в setTimeout/setInterval не гарантирует точное время выполнения, а задает лишь минимальную задержку."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst timerId = setTimeout(() => {\n  fn();\n}, delay);\n// Отмена:\nclearTimeout(timerId);\n```"
    }
  },
  "js73": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронными таймерами браузера (macrotasks в Event Loop). Сохраняйте идентификатор таймера (timerId = setTimeout/setInterval) для возможности его отмены через clearTimeout/clearInterval."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно очищайте таймеры при уничтожении/отмене, чтобы предотвратить утечки памяти.\n• Помните, что задержка в setTimeout/setInterval не гарантирует точное время выполнения, а задает лишь минимальную задержку."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst timerId = setTimeout(() => {\n  fn();\n}, delay);\n// Отмена:\nclearTimeout(timerId);\n```"
    }
  },
  "js74": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронными таймерами браузера (macrotasks в Event Loop). Сохраняйте идентификатор таймера (timerId = setTimeout/setInterval) для возможности его отмены через clearTimeout/clearInterval."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно очищайте таймеры при уничтожении/отмене, чтобы предотвратить утечки памяти.\n• Помните, что задержка в setTimeout/setInterval не гарантирует точное время выполнения, а задает лишь минимальную задержку."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst timerId = setTimeout(() => {\n  fn();\n}, delay);\n// Отмена:\nclearTimeout(timerId);\n```"
    }
  },
  "js75": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронными таймерами браузера (macrotasks в Event Loop). Сохраняйте идентификатор таймера (timerId = setTimeout/setInterval) для возможности его отмены через clearTimeout/clearInterval."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно очищайте таймеры при уничтожении/отмене, чтобы предотвратить утечки памяти.\n• Помните, что задержка в setTimeout/setInterval не гарантирует точное время выполнения, а задает лишь минимальную задержку."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst timerId = setTimeout(() => {\n  fn();\n}, delay);\n// Отмена:\nclearTimeout(timerId);\n```"
    }
  },
  "js76": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронными таймерами браузера (macrotasks в Event Loop). Сохраняйте идентификатор таймера (timerId = setTimeout/setInterval) для возможности его отмены через clearTimeout/clearInterval."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно очищайте таймеры при уничтожении/отмене, чтобы предотвратить утечки памяти.\n• Помните, что задержка в setTimeout/setInterval не гарантирует точное время выполнения, а задает лишь минимальную задержку."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst timerId = setTimeout(() => {\n  fn();\n}, delay);\n// Отмена:\nclearTimeout(timerId);\n```"
    }
  },
  "js77": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронными таймерами браузера (macrotasks в Event Loop). Сохраняйте идентификатор таймера (timerId = setTimeout/setInterval) для возможности его отмены через clearTimeout/clearInterval."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно очищайте таймеры при уничтожении/отмене, чтобы предотвратить утечки памяти.\n• Помните, что задержка в setTimeout/setInterval не гарантирует точное время выполнения, а задает лишь минимальную задержку."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst timerId = setTimeout(() => {\n  fn();\n}, delay);\n// Отмена:\nclearTimeout(timerId);\n```"
    }
  },
  "js78": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронными таймерами браузера (macrotasks в Event Loop). Сохраняйте идентификатор таймера (timerId = setTimeout/setInterval) для возможности его отмены через clearTimeout/clearInterval."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно очищайте таймеры при уничтожении/отмене, чтобы предотвратить утечки памяти.\n• Помните, что задержка в setTimeout/setInterval не гарантирует точное время выполнения, а задает лишь минимальную задержку."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst timerId = setTimeout(() => {\n  fn();\n}, delay);\n// Отмена:\nclearTimeout(timerId);\n```"
    }
  },
  "js79": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронными таймерами браузера (macrotasks в Event Loop). Сохраняйте идентификатор таймера (timerId = setTimeout/setInterval) для возможности его отмены через clearTimeout/clearInterval."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно очищайте таймеры при уничтожении/отмене, чтобы предотвратить утечки памяти.\n• Помните, что задержка в setTimeout/setInterval не гарантирует точное время выполнения, а задает лишь минимальную задержку."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst timerId = setTimeout(() => {\n  fn();\n}, delay);\n// Отмена:\nclearTimeout(timerId);\n```"
    }
  },
  "js80": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронными таймерами браузера (macrotasks в Event Loop). Сохраняйте идентификатор таймера (timerId = setTimeout/setInterval) для возможности его отмены через clearTimeout/clearInterval."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно очищайте таймеры при уничтожении/отмене, чтобы предотвратить утечки памяти.\n• Помните, что задержка в setTimeout/setInterval не гарантирует точное время выполнения, а задает лишь минимальную задержку."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst timerId = setTimeout(() => {\n  fn();\n}, delay);\n// Отмена:\nclearTimeout(timerId);\n```"
    }
  },
  "js81": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: использование структур данных Map или Set. Set хранит уникальные значения любого типа, Map — пары ключ-значение с ключами любого типа (включая объекты и функции)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Объекты в Map/Set сравниваются по ссылке (SameValueZero), а не по структуре.\n• Методы size, get, set, has, delete работают в среднем за $O(1)$."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst map = new Map();\nmap.set(key, value);\nif (map.has(key)) {\n  return map.get(key);\n}\n```"
    }
  },
  "js82": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: использование структур данных Map или Set. Set хранит уникальные значения любого типа, Map — пары ключ-значение с ключами любого типа (включая объекты и функции)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Объекты в Map/Set сравниваются по ссылке (SameValueZero), а не по структуре.\n• Методы size, get, set, has, delete работают в среднем за $O(1)$."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst map = new Map();\nmap.set(key, value);\nif (map.has(key)) {\n  return map.get(key);\n}\n```"
    }
  },
  "js83": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: использование структур данных Map или Set. Set хранит уникальные значения любого типа, Map — пары ключ-значение с ключами любого типа (включая объекты и функции)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Объекты в Map/Set сравниваются по ссылке (SameValueZero), а не по структуре.\n• Методы size, get, set, has, delete работают в среднем за $O(1)$."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst map = new Map();\nmap.set(key, value);\nif (map.has(key)) {\n  return map.get(key);\n}\n```"
    }
  },
  "js84": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: использование структур данных Map или Set. Set хранит уникальные значения любого типа, Map — пары ключ-значение с ключами любого типа (включая объекты и функции)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Объекты в Map/Set сравниваются по ссылке (SameValueZero), а не по структуре.\n• Методы size, get, set, has, delete работают в среднем за $O(1)$."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst map = new Map();\nmap.set(key, value);\nif (map.has(key)) {\n  return map.get(key);\n}\n```"
    }
  },
  "js85": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: использование структур данных Map или Set. Set хранит уникальные значения любого типа, Map — пары ключ-значение с ключами любого типа (включая объекты и функции)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Объекты в Map/Set сравниваются по ссылке (SameValueZero), а не по структуре.\n• Методы size, get, set, has, delete работают в среднем за $O(1)$."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst map = new Map();\nmap.set(key, value);\nif (map.has(key)) {\n  return map.get(key);\n}\n```"
    }
  },
  "js86": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: использование структур данных Map или Set. Set хранит уникальные значения любого типа, Map — пары ключ-значение с ключами любого типа (включая объекты и функции)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Объекты в Map/Set сравниваются по ссылке (SameValueZero), а не по структуре.\n• Методы size, get, set, has, delete работают в среднем за $O(1)$."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst map = new Map();\nmap.set(key, value);\nif (map.has(key)) {\n  return map.get(key);\n}\n```"
    }
  },
  "js87": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: использование структур данных Map или Set. Set хранит уникальные значения любого типа, Map — пары ключ-значение с ключами любого типа (включая объекты и функции)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Объекты в Map/Set сравниваются по ссылке (SameValueZero), а не по структуре.\n• Методы size, get, set, has, delete работают в среднем за $O(1)$."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst map = new Map();\nmap.set(key, value);\nif (map.has(key)) {\n  return map.get(key);\n}\n```"
    }
  },
  "js88": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: использование структур данных Map или Set. Set хранит уникальные значения любого типа, Map — пары ключ-значение с ключами любого типа (включая объекты и функции)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Объекты в Map/Set сравниваются по ссылке (SameValueZero), а не по структуре.\n• Методы size, get, set, has, delete работают в среднем за $O(1)$."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst map = new Map();\nmap.set(key, value);\nif (map.has(key)) {\n  return map.get(key);\n}\n```"
    }
  },
  "js89": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: использование структур данных Map или Set. Set хранит уникальные значения любого типа, Map — пары ключ-значение с ключами любого типа (включая объекты и функции)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Объекты в Map/Set сравниваются по ссылке (SameValueZero), а не по структуре.\n• Методы size, get, set, has, delete работают в среднем за $O(1)$."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst map = new Map();\nmap.set(\"key\", 1);\n```"
    }
  },
  "js125": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронным кодом через Promises и async/await. Промис находится в одном из трех состояний: pending, fulfilled или rejected. Микротаски промисов выполняются раньше макротасок таймеров."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно обрабатывайте ошибки через .catch() или try/catch в async функциях (unhandled rejection).\n• Параллельные независимые запросы запускайте через Promise.all, а не последовательными await в цикле."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nasync function handleAsync() {\n  try {\n    const res = await fetchSomething();\n    return res;\n  } catch (err) {\n    console.error(err);\n    throw err;\n  }\n}\n```"
    }
  },
  "js185": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Обе цепочки промисов стартуют синхронно. Колбэки `.then()` и `.catch()` ставятся в очередь микрозадач (Microtask Queue FIFO) и продвигаются по одному шагу за раз, чередуясь между первой и второй цепочкой."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Если состояние промиса не соответствует обработчику (например, `.catch` на resolved-промисе или `.then` без onRejected на rejected-промисе), колбэк пропускается, но проброс статуса всё равно занимает ровно 1 тик микрозадачи!\n• После успешного выполнения `.catch()` (без throw) промис переходит в состояние fulfilled, поэтому следующий за ним `.then()` обязательно выполнится."
    },
    "level3": {
      "title": "Пошаговая трассировка тиков",
      "content": "Тик 1: then(1) → 1\nТик 2: проброс reject мимо then(5)\nТик 3: then(2) → 2\nТик 4: проброс reject мимо then(6)\nТик 5: проброс resolve мимо catch(3)\nТик 6: catch(7) → 7\nТик 7: then(4) → 4\nТик 8: then(8) → 8\n\nИтоговый вывод: 1, 2, 7, 4, 8"
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst map = new Map();\nmap.set(key, value);\nif (map.has(key)) {\n  return map.get(key);\n}\n```"
    }
  },
  "js91": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: использование структур данных Map или Set. Set хранит уникальные значения любого типа, Map — пары ключ-значение с ключами любого типа (включая объекты и функции)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Объекты в Map/Set сравниваются по ссылке (SameValueZero), а не по структуре.\n• Методы size, get, set, has, delete работают в среднем за $O(1)$."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst map = new Map();\nmap.set(key, value);\nif (map.has(key)) {\n  return map.get(key);\n}\n```"
    }
  },
  "js92": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: использование структур данных Map или Set. Set хранит уникальные значения любого типа, Map — пары ключ-значение с ключами любого типа (включая объекты и функции)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Объекты в Map/Set сравниваются по ссылке (SameValueZero), а не по структуре.\n• Методы size, get, set, has, delete работают в среднем за $O(1)$."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst map = new Map();\nmap.set(key, value);\nif (map.has(key)) {\n  return map.get(key);\n}\n```"
    }
  },
  "js93": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: использование структур данных Map или Set. Set хранит уникальные значения любого типа, Map — пары ключ-значение с ключами любого типа (включая объекты и функции)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Объекты в Map/Set сравниваются по ссылке (SameValueZero), а не по структуре.\n• Методы size, get, set, has, delete работают в среднем за $O(1)$."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst map = new Map();\nmap.set(key, value);\nif (map.has(key)) {\n  return map.get(key);\n}\n```"
    }
  },
  "js94": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: использование структур данных Map или Set. Set хранит уникальные значения любого типа, Map — пары ключ-значение с ключами любого типа (включая объекты и функции)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Объекты в Map/Set сравниваются по ссылке (SameValueZero), а не по структуре.\n• Методы size, get, set, has, delete работают в среднем за $O(1)$."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst map = new Map();\nmap.set(key, value);\nif (map.has(key)) {\n  return map.get(key);\n}\n```"
    }
  },
  "js95": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: использование структур данных Map или Set. Set хранит уникальные значения любого типа, Map — пары ключ-значение с ключами любого типа (включая объекты и функции)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Объекты в Map/Set сравниваются по ссылке (SameValueZero), а не по структуре.\n• Методы size, get, set, has, delete работают в среднем за $O(1)$."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst map = new Map();\nmap.set(key, value);\nif (map.has(key)) {\n  return map.get(key);\n}\n```"
    }
  },
  "js96": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: использование структур данных Map или Set. Set хранит уникальные значения любого типа, Map — пары ключ-значение с ключами любого типа (включая объекты и функции)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Объекты в Map/Set сравниваются по ссылке (SameValueZero), а не по структуре.\n• Методы size, get, set, has, delete работают в среднем за $O(1)$."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst map = new Map();\nmap.set(key, value);\nif (map.has(key)) {\n  return map.get(key);\n}\n```"
    }
  },
  "js97": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: использование структур данных Map или Set. Set хранит уникальные значения любого типа, Map — пары ключ-значение с ключами любого типа (включая объекты и функции)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Объекты в Map/Set сравниваются по ссылке (SameValueZero), а не по структуре.\n• Методы size, get, set, has, delete работают в среднем за $O(1)$."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst map = new Map();\nmap.set(key, value);\nif (map.has(key)) {\n  return map.get(key);\n}\n```"
    }
  },
  "js98": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: использование структур данных Map или Set. Set хранит уникальные значения любого типа, Map — пары ключ-значение с ключами любого типа (включая объекты и функции)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Объекты в Map/Set сравниваются по ссылке (SameValueZero), а не по структуре.\n• Методы size, get, set, has, delete работают в среднем за $O(1)$."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst map = new Map();\nmap.set(key, value);\nif (map.has(key)) {\n  return map.get(key);\n}\n```"
    }
  },
  "js99": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: использование структур данных Map или Set. Set хранит уникальные значения любого типа, Map — пары ключ-значение с ключами любого типа (включая объекты и функции)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Объекты в Map/Set сравниваются по ссылке (SameValueZero), а не по структуре.\n• Методы size, get, set, has, delete работают в среднем за $O(1)$."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst map = new Map();\nmap.set(key, value);\nif (map.has(key)) {\n  return map.get(key);\n}\n```"
    }
  },
  "js100": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: использование структур данных Map или Set. Set хранит уникальные значения любого типа, Map — пары ключ-значение с ключами любого типа (включая объекты и функции)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Объекты в Map/Set сравниваются по ссылке (SameValueZero), а не по структуре.\n• Методы size, get, set, has, delete работают в среднем за $O(1)$."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst map = new Map();\nmap.set(key, value);\nif (map.has(key)) {\n  return map.get(key);\n}\n```"
    }
  },
  "js101": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: использование структур данных Map или Set. Set хранит уникальные значения любого типа, Map — пары ключ-значение с ключами любого типа (включая объекты и функции)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Объекты в Map/Set сравниваются по ссылке (SameValueZero), а не по структуре.\n• Методы size, get, set, has, delete работают в среднем за $O(1)$."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst map = new Map();\nmap.set(key, value);\nif (map.has(key)) {\n  return map.get(key);\n}\n```"
    }
  },
  "js102": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: использование структур данных Map или Set. Set хранит уникальные значения любого типа, Map — пары ключ-значение с ключами любого типа (включая объекты и функции)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Объекты в Map/Set сравниваются по ссылке (SameValueZero), а не по структуре.\n• Методы size, get, set, has, delete работают в среднем за $O(1)$."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst map = new Map();\nmap.set(key, value);\nif (map.has(key)) {\n  return map.get(key);\n}\n```"
    }
  },
  "js103": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронным кодом через Promises и async/await. Промис находится в одном из трех состояний: pending, fulfilled или rejected. Микротаски промисов выполняются раньше макротасок таймеров."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно обрабатывайте ошибки через .catch() или try/catch в async функциях (unhandled rejection).\n• Параллельные независимые запросы запускайте через Promise.all, а не последовательными await в цикле."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nasync function handleAsync() {\n  try {\n    const res = await fetchSomething();\n    return res;\n  } catch (err) {\n    console.error(err);\n    throw err;\n  }\n}\n```"
    }
  },
  "js104": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронным кодом через Promises и async/await. Промис находится в одном из трех состояний: pending, fulfilled или rejected. Микротаски промисов выполняются раньше макротасок таймеров."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно обрабатывайте ошибки через .catch() или try/catch в async функциях (unhandled rejection).\n• Параллельные независимые запросы запускайте через Promise.all, а не последовательными await в цикле."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nasync function handleAsync() {\n  try {\n    const res = await fetchSomething();\n    return res;\n  } catch (err) {\n    console.error(err);\n    throw err;\n  }\n}\n```"
    }
  },
  "js105": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронным кодом через Promises и async/await. Промис находится в одном из трех состояний: pending, fulfilled или rejected. Микротаски промисов выполняются раньше макротасок таймеров."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно обрабатывайте ошибки через .catch() или try/catch в async функциях (unhandled rejection).\n• Параллельные независимые запросы запускайте через Promise.all, а не последовательными await в цикле."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nasync function handleAsync() {\n  try {\n    const res = await fetchSomething();\n    return res;\n  } catch (err) {\n    console.error(err);\n    throw err;\n  }\n}\n```"
    }
  },
  "js106": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронным кодом через Promises и async/await. Промис находится в одном из трех состояний: pending, fulfilled или rejected. Микротаски промисов выполняются раньше макротасок таймеров."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно обрабатывайте ошибки через .catch() или try/catch в async функциях (unhandled rejection).\n• Параллельные независимые запросы запускайте через Promise.all, а не последовательными await в цикле."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nasync function handleAsync() {\n  try {\n    const res = await fetchSomething();\n    return res;\n  } catch (err) {\n    console.error(err);\n    throw err;\n  }\n}\n```"
    }
  },
  "js107": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронным кодом через Promises и async/await. Промис находится в одном из трех состояний: pending, fulfilled или rejected. Микротаски промисов выполняются раньше макротасок таймеров."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно обрабатывайте ошибки через .catch() или try/catch в async функциях (unhandled rejection).\n• Параллельные независимые запросы запускайте через Promise.all, а не последовательными await в цикле."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nasync function handleAsync() {\n  try {\n    const res = await fetchSomething();\n    return res;\n  } catch (err) {\n    console.error(err);\n    throw err;\n  }\n}\n```"
    }
  },
  "js108": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронным кодом через Promises и async/await. Промис находится в одном из трех состояний: pending, fulfilled или rejected. Микротаски промисов выполняются раньше макротасок таймеров."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно обрабатывайте ошибки через .catch() или try/catch в async функциях (unhandled rejection).\n• Параллельные независимые запросы запускайте через Promise.all, а не последовательными await в цикле."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nasync function handleAsync() {\n  try {\n    const res = await fetchSomething();\n    return res;\n  } catch (err) {\n    console.error(err);\n    throw err;\n  }\n}\n```"
    }
  },
  "js109": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронным кодом через Promises и async/await. Промис находится в одном из трех состояний: pending, fulfilled или rejected. Микротаски промисов выполняются раньше макротасок таймеров."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно обрабатывайте ошибки через .catch() или try/catch в async функциях (unhandled rejection).\n• Параллельные независимые запросы запускайте через Promise.all, а не последовательными await в цикле."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nasync function handleAsync() {\n  try {\n    const res = await fetchSomething();\n    return res;\n  } catch (err) {\n    console.error(err);\n    throw err;\n  }\n}\n```"
    }
  },
  "js110": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронным кодом через Promises и async/await. Промис находится в одном из трех состояний: pending, fulfilled или rejected. Микротаски промисов выполняются раньше макротасок таймеров."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно обрабатывайте ошибки через .catch() или try/catch в async функциях (unhandled rejection).\n• Параллельные независимые запросы запускайте через Promise.all, а не последовательными await в цикле."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nasync function handleAsync() {\n  try {\n    const res = await fetchSomething();\n    return res;\n  } catch (err) {\n    console.error(err);\n    throw err;\n  }\n}\n```"
    }
  },
  "js111": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронным кодом через Promises и async/await. Промис находится в одном из трех состояний: pending, fulfilled или rejected. Микротаски промисов выполняются раньше макротасок таймеров."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно обрабатывайте ошибки через .catch() или try/catch в async функциях (unhandled rejection).\n• Параллельные независимые запросы запускайте через Promise.all, а не последовательными await в цикле."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nasync function handleAsync() {\n  try {\n    const res = await fetchSomething();\n    return res;\n  } catch (err) {\n    console.error(err);\n    throw err;\n  }\n}\n```"
    }
  },
  "js112": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронным кодом через Promises и async/await. Промис находится в одном из трех состояний: pending, fulfilled или rejected. Микротаски промисов выполняются раньше макротасок таймеров."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно обрабатывайте ошибки через .catch() или try/catch в async функциях (unhandled rejection).\n• Параллельные независимые запросы запускайте через Promise.all, а не последовательными await в цикле."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nasync function handleAsync() {\n  try {\n    const res = await fetchSomething();\n    return res;\n  } catch (err) {\n    console.error(err);\n    throw err;\n  }\n}\n```"
    }
  },
  "js113": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронным кодом через Promises и async/await. Промис находится в одном из трех состояний: pending, fulfilled или rejected. Микротаски промисов выполняются раньше макротасок таймеров."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно обрабатывайте ошибки через .catch() или try/catch в async функциях (unhandled rejection).\n• Параллельные независимые запросы запускайте через Promise.all, а не последовательными await в цикле."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nasync function handleAsync() {\n  try {\n    const res = await fetchSomething();\n    return res;\n  } catch (err) {\n    console.error(err);\n    throw err;\n  }\n}\n```"
    }
  },
  "js114": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронным кодом через Promises и async/await. Промис находится в одном из трех состояний: pending, fulfilled или rejected. Микротаски промисов выполняются раньше макротасок таймеров."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно обрабатывайте ошибки через .catch() или try/catch в async функциях (unhandled rejection).\n• Параллельные независимые запросы запускайте через Promise.all, а не последовательными await в цикле."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nasync function handleAsync() {\n  try {\n    const res = await fetchSomething();\n    return res;\n  } catch (err) {\n    console.error(err);\n    throw err;\n  }\n}\n```"
    }
  },
  "js115": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронным кодом через Promises и async/await. Промис находится в одном из трех состояний: pending, fulfilled или rejected. Микротаски промисов выполняются раньше макротасок таймеров."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно обрабатывайте ошибки через .catch() или try/catch в async функциях (unhandled rejection).\n• Параллельные независимые запросы запускайте через Promise.all, а не последовательными await в цикле."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nasync function handleAsync() {\n  try {\n    const res = await fetchSomething();\n    return res;\n  } catch (err) {\n    console.error(err);\n    throw err;\n  }\n}\n```"
    }
  },
  "js116": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронным кодом через Promises и async/await. Промис находится в одном из трех состояний: pending, fulfilled или rejected. Микротаски промисов выполняются раньше макротасок таймеров."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно обрабатывайте ошибки через .catch() или try/catch в async функциях (unhandled rejection).\n• Параллельные независимые запросы запускайте через Promise.all, а не последовательными await в цикле."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nasync function handleAsync() {\n  try {\n    const res = await fetchSomething();\n    return res;\n  } catch (err) {\n    console.error(err);\n    throw err;\n  }\n}\n```"
    }
  },
  "js117": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронным кодом через Promises и async/await. Промис находится в одном из трех состояний: pending, fulfilled или rejected. Микротаски промисов выполняются раньше макротасок таймеров."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно обрабатывайте ошибки через .catch() или try/catch в async функциях (unhandled rejection).\n• Параллельные независимые запросы запускайте через Promise.all, а не последовательными await в цикле."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nasync function handleAsync() {\n  try {\n    const res = await fetchSomething();\n    return res;\n  } catch (err) {\n    console.error(err);\n    throw err;\n  }\n}\n```"
    }
  },
  "js118": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронным кодом через Promises и async/await. Промис находится в одном из трех состояний: pending, fulfilled или rejected. Микротаски промисов выполняются раньше макротасок таймеров."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно обрабатывайте ошибки через .catch() или try/catch в async функциях (unhandled rejection).\n• Параллельные независимые запросы запускайте через Promise.all, а не последовательными await в цикле."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nasync function handleAsync() {\n  try {\n    const res = await fetchSomething();\n    return res;\n  } catch (err) {\n    console.error(err);\n    throw err;\n  }\n}\n```"
    }
  },
  "js119": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронным кодом через Promises и async/await. Промис находится в одном из трех состояний: pending, fulfilled или rejected. Микротаски промисов выполняются раньше макротасок таймеров."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно обрабатывайте ошибки через .catch() или try/catch в async функциях (unhandled rejection).\n• Параллельные независимые запросы запускайте через Promise.all, а не последовательными await в цикле."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nasync function handleAsync() {\n  try {\n    const res = await fetchSomething();\n    return res;\n  } catch (err) {\n    console.error(err);\n    throw err;\n  }\n}\n```"
    }
  },
  "js120": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронным кодом через Promises и async/await. Промис находится в одном из трех состояний: pending, fulfilled или rejected. Микротаски промисов выполняются раньше макротасок таймеров."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно обрабатывайте ошибки через .catch() или try/catch в async функциях (unhandled rejection).\n• Параллельные независимые запросы запускайте через Promise.all, а не последовательными await в цикле."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nasync function handleAsync() {\n  try {\n    const res = await fetchSomething();\n    return res;\n  } catch (err) {\n    console.error(err);\n    throw err;\n  }\n}\n```"
    }
  },
  "js121": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронным кодом через Promises и async/await. Промис находится в одном из трех состояний: pending, fulfilled или rejected. Микротаски промисов выполняются раньше макротасок таймеров."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно обрабатывайте ошибки через .catch() или try/catch в async функциях (unhandled rejection).\n• Параллельные независимые запросы запускайте через Promise.all, а не последовательными await в цикле."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nasync function handleAsync() {\n  try {\n    const res = await fetchSomething();\n    return res;\n  } catch (err) {\n    console.error(err);\n    throw err;\n  }\n}\n```"
    }
  },
  "js122": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронным кодом через Promises и async/await. Промис находится в одном из трех состояний: pending, fulfilled или rejected. Микротаски промисов выполняются раньше макротасок таймеров."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно обрабатывайте ошибки через .catch() или try/catch в async функциях (unhandled rejection).\n• Параллельные независимые запросы запускайте через Promise.all, а не последовательными await в цикле."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nasync function handleAsync() {\n  try {\n    const res = await fetchSomething();\n    return res;\n  } catch (err) {\n    console.error(err);\n    throw err;\n  }\n}\n```"
    }
  },
  "js123": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронным кодом через Promises и async/await. Промис находится в одном из трех состояний: pending, fulfilled или rejected. Микротаски промисов выполняются раньше макротасок таймеров."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно обрабатывайте ошибки через .catch() или try/catch в async функциях (unhandled rejection).\n• Параллельные независимые запросы запускайте через Promise.all, а не последовательными await в цикле."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nasync function handleAsync() {\n  try {\n    const res = await fetchSomething();\n    return res;\n  } catch (err) {\n    console.error(err);\n    throw err;\n  }\n}\n```"
    }
  },
  "js124": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронным кодом через Promises и async/await. Промис находится в одном из трех состояний: pending, fulfilled или rejected. Микротаски промисов выполняются раньше макротасок таймеров."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно обрабатывайте ошибки через .catch() или try/catch в async функциях (unhandled rejection).\n• Параллельные независимые запросы запускайте через Promise.all, а не последовательными await в цикле."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nasync function handleAsync() {\n  try {\n    const res = await fetchSomething();\n    return res;\n  } catch (err) {\n    console.error(err);\n    throw err;\n  }\n}\n```"
    }
  },
  "js125": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: работа с асинхронным кодом через Promises и async/await. Промис находится в одном из трех состояний: pending, fulfilled или rejected. Микротаски промисов выполняются раньше макротасок таймеров."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обязательно обрабатывайте ошибки через .catch() или try/catch в async функциях (unhandled rejection).\n• Параллельные независимые запросы запускайте через Promise.all, а не последовательными await в цикле."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nasync function handleAsync() {\n  try {\n    const res = await fetchSomething();\n    return res;\n  } catch (err) {\n    console.error(err);\n    throw err;\n  }\n}\n```"
    }
  },
  "js126": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: замыкание (closure) — это комбинация функции и лексического окружения, в котором эта функция была объявлена. Функция сохраняет доступ к переменным внешней области видимости даже после её завершения."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• В циклах с var переменная разделяется между всеми итерациями; используйте let (блочная область) или IIFE для создания отдельного замыкания на каждую итерацию.\n• Замыкания удерживают ссылки на переменные в памяти (потенциальные утечки)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction createCounter() {\n  let count = 0;\n  return function() {\n    return ++count;\n  };\n}\n```"
    }
  },
  "js127": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: замыкание (closure) — это комбинация функции и лексического окружения, в котором эта функция была объявлена. Функция сохраняет доступ к переменным внешней области видимости даже после её завершения."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• В циклах с var переменная разделяется между всеми итерациями; используйте let (блочная область) или IIFE для создания отдельного замыкания на каждую итерацию.\n• Замыкания удерживают ссылки на переменные в памяти (потенциальные утечки)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction createCounter() {\n  let count = 0;\n  return function() {\n    return ++count;\n  };\n}\n```"
    }
  },
  "js128": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: замыкание (closure) — это комбинация функции и лексического окружения, в котором эта функция была объявлена. Функция сохраняет доступ к переменным внешней области видимости даже после её завершения."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• В циклах с var переменная разделяется между всеми итерациями; используйте let (блочная область) или IIFE для создания отдельного замыкания на каждую итерацию.\n• Замыкания удерживают ссылки на переменные в памяти (потенциальные утечки)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction createCounter() {\n  let count = 0;\n  return function() {\n    return ++count;\n  };\n}\n```"
    }
  },
  "js129": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: замыкание (closure) — это комбинация функции и лексического окружения, в котором эта функция была объявлена. Функция сохраняет доступ к переменным внешней области видимости даже после её завершения."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• В циклах с var переменная разделяется между всеми итерациями; используйте let (блочная область) или IIFE для создания отдельного замыкания на каждую итерацию.\n• Замыкания удерживают ссылки на переменные в памяти (потенциальные утечки)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction createCounter() {\n  let count = 0;\n  return function() {\n    return ++count;\n  };\n}\n```"
    }
  },
  "js130": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: замыкание (closure) — это комбинация функции и лексического окружения, в котором эта функция была объявлена. Функция сохраняет доступ к переменным внешней области видимости даже после её завершения."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• В циклах с var переменная разделяется между всеми итерациями; используйте let (блочная область) или IIFE для создания отдельного замыкания на каждую итерацию.\n• Замыкания удерживают ссылки на переменные в памяти (потенциальные утечки)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction createCounter() {\n  let count = 0;\n  return function() {\n    return ++count;\n  };\n}\n```"
    }
  },
  "js131": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: замыкание (closure) — это комбинация функции и лексического окружения, в котором эта функция была объявлена. Функция сохраняет доступ к переменным внешней области видимости даже после её завершения."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• В циклах с var переменная разделяется между всеми итерациями; используйте let (блочная область) или IIFE для создания отдельного замыкания на каждую итерацию.\n• Замыкания удерживают ссылки на переменные в памяти (потенциальные утечки)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction createCounter() {\n  let count = 0;\n  return function() {\n    return ++count;\n  };\n}\n```"
    }
  },
  "js132": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: рекурсивная функция вызывает сама себя. Всегда начинайте с определения базового случая (base case) — условия выхода из рекурсии, без которого произойдет RangeError: Maximum call stack size exceeded."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Убедитесь, что каждый шаг уменьшает сложность задачи и гарантированно приближает к базовому случаю.\n• Для глубокой рекурсии помните о лимите стека вызовов в JS (~10 000 фреймов)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction recursive(node) {\n  if (!node) return 0; // Базовый случай\n  return 1 + recursive(node.next); // Рекурсивный шаг\n}\n```"
    }
  },
  "js133": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: рекурсивная функция вызывает сама себя. Всегда начинайте с определения базового случая (base case) — условия выхода из рекурсии, без которого произойдет RangeError: Maximum call stack size exceeded."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Убедитесь, что каждый шаг уменьшает сложность задачи и гарантированно приближает к базовому случаю.\n• Для глубокой рекурсии помните о лимите стека вызовов в JS (~10 000 фреймов)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction recursive(node) {\n  if (!node) return 0; // Базовый случай\n  return 1 + recursive(node.next); // Рекурсивный шаг\n}\n```"
    }
  },
  "js134": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: рекурсивная функция вызывает сама себя. Всегда начинайте с определения базового случая (base case) — условия выхода из рекурсии, без которого произойдет RangeError: Maximum call stack size exceeded."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Убедитесь, что каждый шаг уменьшает сложность задачи и гарантированно приближает к базовому случаю.\n• Для глубокой рекурсии помните о лимите стека вызовов в JS (~10 000 фреймов)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction recursive(node) {\n  if (!node) return 0; // Базовый случай\n  return 1 + recursive(node.next); // Рекурсивный шаг\n}\n```"
    }
  },
  "js135": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: рекурсивная функция вызывает сама себя. Всегда начинайте с определения базового случая (base case) — условия выхода из рекурсии, без которого произойдет RangeError: Maximum call stack size exceeded."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Убедитесь, что каждый шаг уменьшает сложность задачи и гарантированно приближает к базовому случаю.\n• Для глубокой рекурсии помните о лимите стека вызовов в JS (~10 000 фреймов)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction recursive(node) {\n  if (!node) return 0; // Базовый случай\n  return 1 + recursive(node.next); // Рекурсивный шаг\n}\n```"
    }
  },
  "js136": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: рекурсивная функция вызывает сама себя. Всегда начинайте с определения базового случая (base case) — условия выхода из рекурсии, без которого произойдет RangeError: Maximum call stack size exceeded."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Убедитесь, что каждый шаг уменьшает сложность задачи и гарантированно приближает к базовому случаю.\n• Для глубокой рекурсии помните о лимите стека вызовов в JS (~10 000 фреймов)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction recursive(node) {\n  if (!node) return 0; // Базовый случай\n  return 1 + recursive(node.next); // Рекурсивный шаг\n}\n```"
    }
  },
  "js137": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: рекурсивная функция вызывает сама себя. Всегда начинайте с определения базового случая (base case) — условия выхода из рекурсии, без которого произойдет RangeError: Maximum call stack size exceeded."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Убедитесь, что каждый шаг уменьшает сложность задачи и гарантированно приближает к базовому случаю.\n• Для глубокой рекурсии помните о лимите стека вызовов в JS (~10 000 фреймов)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction recursive(node) {\n  if (!node) return 0; // Базовый случай\n  return 1 + recursive(node.next); // Рекурсивный шаг\n}\n```"
    }
  },
  "js138": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: рекурсивная функция вызывает сама себя. Всегда начинайте с определения базового случая (base case) — условия выхода из рекурсии, без которого произойдет RangeError: Maximum call stack size exceeded."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Убедитесь, что каждый шаг уменьшает сложность задачи и гарантированно приближает к базовому случаю.\n• Для глубокой рекурсии помните о лимите стека вызовов в JS (~10 000 фреймов)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction recursive(node) {\n  if (!node) return 0; // Базовый случай\n  return 1 + recursive(node.next); // Рекурсивный шаг\n}\n```"
    }
  },
  "js139": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: рекурсивная функция вызывает сама себя. Всегда начинайте с определения базового случая (base case) — условия выхода из рекурсии, без которого произойдет RangeError: Maximum call stack size exceeded."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Убедитесь, что каждый шаг уменьшает сложность задачи и гарантированно приближает к базовому случаю.\n• Для глубокой рекурсии помните о лимите стека вызовов в JS (~10 000 фреймов)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction recursive(node) {\n  if (!node) return 0; // Базовый случай\n  return 1 + recursive(node.next); // Рекурсивный шаг\n}\n```"
    }
  },
  "js140": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: рекурсивная функция вызывает сама себя. Всегда начинайте с определения базового случая (base case) — условия выхода из рекурсии, без которого произойдет RangeError: Maximum call stack size exceeded."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Убедитесь, что каждый шаг уменьшает сложность задачи и гарантированно приближает к базовому случаю.\n• Для глубокой рекурсии помните о лимите стека вызовов в JS (~10 000 фреймов)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction recursive(node) {\n  if (!node) return 0; // Базовый случай\n  return 1 + recursive(node.next); // Рекурсивный шаг\n}\n```"
    }
  },
  "js141": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: рекурсивная функция вызывает сама себя. Всегда начинайте с определения базового случая (base case) — условия выхода из рекурсии, без которого произойдет RangeError: Maximum call stack size exceeded."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Убедитесь, что каждый шаг уменьшает сложность задачи и гарантированно приближает к базовому случаю.\n• Для глубокой рекурсии помните о лимите стека вызовов в JS (~10 000 фреймов)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction recursive(node) {\n  if (!node) return 0; // Базовый случай\n  return 1 + recursive(node.next); // Рекурсивный шаг\n}\n```"
    }
  },
  "js142": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: рекурсивная функция вызывает сама себя. Всегда начинайте с определения базового случая (base case) — условия выхода из рекурсии, без которого произойдет RangeError: Maximum call stack size exceeded."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Убедитесь, что каждый шаг уменьшает сложность задачи и гарантированно приближает к базовому случаю.\n• Для глубокой рекурсии помните о лимите стека вызовов в JS (~10 000 фреймов)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction recursive(node) {\n  if (!node) return 0; // Базовый случай\n  return 1 + recursive(node.next); // Рекурсивный шаг\n}\n```"
    }
  },
  "js143": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: рекурсивная функция вызывает сама себя. Всегда начинайте с определения базового случая (base case) — условия выхода из рекурсии, без которого произойдет RangeError: Maximum call stack size exceeded."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Убедитесь, что каждый шаг уменьшает сложность задачи и гарантированно приближает к базовому случаю.\n• Для глубокой рекурсии помните о лимите стека вызовов в JS (~10 000 фреймов)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction recursive(node) {\n  if (!node) return 0; // Базовый случай\n  return 1 + recursive(node.next); // Рекурсивный шаг\n}\n```"
    }
  },
  "js144": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: рекурсивная функция вызывает сама себя. Всегда начинайте с определения базового случая (base case) — условия выхода из рекурсии, без которого произойдет RangeError: Maximum call stack size exceeded."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Убедитесь, что каждый шаг уменьшает сложность задачи и гарантированно приближает к базовому случаю.\n• Для глубокой рекурсии помните о лимите стека вызовов в JS (~10 000 фреймов)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction recursive(node) {\n  if (!node) return 0; // Базовый случай\n  return 1 + recursive(node.next); // Рекурсивный шаг\n}\n```"
    }
  },
  "js145": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: рекурсивная функция вызывает сама себя. Всегда начинайте с определения базового случая (base case) — условия выхода из рекурсии, без которого произойдет RangeError: Maximum call stack size exceeded."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Убедитесь, что каждый шаг уменьшает сложность задачи и гарантированно приближает к базовому случаю.\n• Для глубокой рекурсии помните о лимите стека вызовов в JS (~10 000 фреймов)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction recursive(node) {\n  if (!node) return 0; // Базовый случай\n  return 1 + recursive(node.next); // Рекурсивный шаг\n}\n```"
    }
  },
  "js146": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: рекурсивная функция вызывает сама себя. Всегда начинайте с определения базового случая (base case) — условия выхода из рекурсии, без которого произойдет RangeError: Maximum call stack size exceeded."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Убедитесь, что каждый шаг уменьшает сложность задачи и гарантированно приближает к базовому случаю.\n• Для глубокой рекурсии помните о лимите стека вызовов в JS (~10 000 фреймов)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction recursive(node) {\n  if (!node) return 0; // Базовый случай\n  return 1 + recursive(node.next); // Рекурсивный шаг\n}\n```"
    }
  },
  "js147": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: рекурсивная функция вызывает сама себя. Всегда начинайте с определения базового случая (base case) — условия выхода из рекурсии, без которого произойдет RangeError: Maximum call stack size exceeded."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Убедитесь, что каждый шаг уменьшает сложность задачи и гарантированно приближает к базовому случаю.\n• Для глубокой рекурсии помните о лимите стека вызовов в JS (~10 000 фреймов)."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction recursive(node) {\n  if (!node) return 0; // Базовый случай\n  return 1 + recursive(node.next); // Рекурсивный шаг\n}\n```"
    }
  },
  "js148": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: контекст this определяется в момент вызова функции (динамический контекст), кроме стрелочных функций (лексический this). Потеря контекста происходит при передаче метода как колбэка."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Для явной привязки контекста используйте .bind(ctx), .call(ctx, ...args), .apply(ctx, [args]).\n• Повторный вызов .bind() не может переопределить уже жестко привязанный контекст."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst boundFn = obj.method.bind(obj);\n```"
    }
  },
  "js149": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: контекст this определяется в момент вызова функции (динамический контекст), кроме стрелочных функций (лексический this). Потеря контекста происходит при передаче метода как колбэка."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Для явной привязки контекста используйте .bind(ctx), .call(ctx, ...args), .apply(ctx, [args]).\n• Повторный вызов .bind() не может переопределить уже жестко привязанный контекст."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst boundFn = obj.method.bind(obj);\n```"
    }
  },
  "js150": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: контекст this определяется в момент вызова функции (динамический контекст), кроме стрелочных функций (лексический this). Потеря контекста происходит при передаче метода как колбэка."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Для явной привязки контекста используйте .bind(ctx), .call(ctx, ...args), .apply(ctx, [args]).\n• Повторный вызов .bind() не может переопределить уже жестко привязанный контекст."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst boundFn = obj.method.bind(obj);\n```"
    }
  },
  "js151": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: контекст this определяется в момент вызова функции (динамический контекст), кроме стрелочных функций (лексический this). Потеря контекста происходит при передаче метода как колбэка."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Для явной привязки контекста используйте .bind(ctx), .call(ctx, ...args), .apply(ctx, [args]).\n• Повторный вызов .bind() не может переопределить уже жестко привязанный контекст."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst boundFn = obj.method.bind(obj);\n```"
    }
  },
  "js152": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: контекст this определяется в момент вызова функции (динамический контекст), кроме стрелочных функций (лексический this). Потеря контекста происходит при передаче метода как колбэка."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Для явной привязки контекста используйте .bind(ctx), .call(ctx, ...args), .apply(ctx, [args]).\n• Повторный вызов .bind() не может переопределить уже жестко привязанный контекст."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst boundFn = obj.method.bind(obj);\n```"
    }
  },
  "js153": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: контекст this определяется в момент вызова функции (динамический контекст), кроме стрелочных функций (лексический this). Потеря контекста происходит при передаче метода как колбэка."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Для явной привязки контекста используйте .bind(ctx), .call(ctx, ...args), .apply(ctx, [args]).\n• Повторный вызов .bind() не может переопределить уже жестко привязанный контекст."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst boundFn = obj.method.bind(obj);\n```"
    }
  },
  "js154": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: контекст this определяется в момент вызова функции (динамический контекст), кроме стрелочных функций (лексический this). Потеря контекста происходит при передаче метода как колбэка."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Для явной привязки контекста используйте .bind(ctx), .call(ctx, ...args), .apply(ctx, [args]).\n• Повторный вызов .bind() не может переопределить уже жестко привязанный контекст."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst boundFn = obj.method.bind(obj);\n```"
    }
  },
  "js155": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: каррирование (currying) трансформирует функцию f(a, b, c) в цепочку вызовов f(a)(b)(c). Пока количество переданных аргументов меньше f.length (арности), возвращается новая функция."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Функция с дефолтными или rest (...args) параметрами имеет length равный количеству обязательных аргументов.\n• Поддерживайте накопление аргументов в замыкании."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) return fn.apply(this, args);\n    return (...nextArgs) => curried.apply(this, [...args, ...nextArgs]);\n  };\n}\n```"
    }
  },
  "js156": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: каррирование (currying) трансформирует функцию f(a, b, c) в цепочку вызовов f(a)(b)(c). Пока количество переданных аргументов меньше f.length (арности), возвращается новая функция."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Функция с дефолтными или rest (...args) параметрами имеет length равный количеству обязательных аргументов.\n• Поддерживайте накопление аргументов в замыкании."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) return fn.apply(this, args);\n    return (...nextArgs) => curried.apply(this, [...args, ...nextArgs]);\n  };\n}\n```"
    }
  },
  "js157": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: каррирование (currying) трансформирует функцию f(a, b, c) в цепочку вызовов f(a)(b)(c). Пока количество переданных аргументов меньше f.length (арности), возвращается новая функция."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Функция с дефолтными или rest (...args) параметрами имеет length равный количеству обязательных аргументов.\n• Поддерживайте накопление аргументов в замыкании."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) return fn.apply(this, args);\n    return (...nextArgs) => curried.apply(this, [...args, ...nextArgs]);\n  };\n}\n```"
    }
  },
  "js158": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: Debounce откладывает выполнение до тех пор, пока не пройдет delay миллисекунд тишины после последнего вызова. Throttle гарантирует выполнение функции не чаще одного раза в указанный интервал."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Сохраняйте контекст this и аргументы args при вызове оригинальной функции (fn.apply(this, args)).\n• Предусмотрите метод отмены (cancel) через clearTimeout."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction debounce(fn, wait) {\n  let timeout;\n  return function(...args) {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => fn.apply(this, args), wait);\n  };\n}\n```"
    }
  },
  "js159": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: Debounce откладывает выполнение до тех пор, пока не пройдет delay миллисекунд тишины после последнего вызова. Throttle гарантирует выполнение функции не чаще одного раза в указанный интервал."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Сохраняйте контекст this и аргументы args при вызове оригинальной функции (fn.apply(this, args)).\n• Предусмотрите метод отмены (cancel) через clearTimeout."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction debounce(fn, wait) {\n  let timeout;\n  return function(...args) {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => fn.apply(this, args), wait);\n  };\n}\n```"
    }
  },
  "js160": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: Debounce откладывает выполнение до тех пор, пока не пройдет delay миллисекунд тишины после последнего вызова. Throttle гарантирует выполнение функции не чаще одного раза в указанный интервал."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Сохраняйте контекст this и аргументы args при вызове оригинальной функции (fn.apply(this, args)).\n• Предусмотрите метод отмены (cancel) через clearTimeout."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction debounce(fn, wait) {\n  let timeout;\n  return function(...args) {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => fn.apply(this, args), wait);\n  };\n}\n```"
    }
  },
  "js161": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: Debounce откладывает выполнение до тех пор, пока не пройдет delay миллисекунд тишины после последнего вызова. Throttle гарантирует выполнение функции не чаще одного раза в указанный интервал."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Сохраняйте контекст this и аргументы args при вызове оригинальной функции (fn.apply(this, args)).\n• Предусмотрите метод отмены (cancel) через clearTimeout."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction debounce(fn, wait) {\n  let timeout;\n  return function(...args) {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => fn.apply(this, args), wait);\n  };\n}\n```"
    }
  },
  "js162": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: Debounce откладывает выполнение до тех пор, пока не пройдет delay миллисекунд тишины после последнего вызова. Throttle гарантирует выполнение функции не чаще одного раза в указанный интервал."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Сохраняйте контекст this и аргументы args при вызове оригинальной функции (fn.apply(this, args)).\n• Предусмотрите метод отмены (cancel) через clearTimeout."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction debounce(fn, wait) {\n  let timeout;\n  return function(...args) {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => fn.apply(this, args), wait);\n  };\n}\n```"
    }
  },
  "js163": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: Debounce откладывает выполнение до тех пор, пока не пройдет delay миллисекунд тишины после последнего вызова. Throttle гарантирует выполнение функции не чаще одного раза в указанный интервал."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Сохраняйте контекст this и аргументы args при вызове оригинальной функции (fn.apply(this, args)).\n• Предусмотрите метод отмены (cancel) через clearTimeout."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction debounce(fn, wait) {\n  let timeout;\n  return function(...args) {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => fn.apply(this, args), wait);\n  };\n}\n```"
    }
  },
  "js164": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: Debounce откладывает выполнение до тех пор, пока не пройдет delay миллисекунд тишины после последнего вызова. Throttle гарантирует выполнение функции не чаще одного раза в указанный интервал."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Сохраняйте контекст this и аргументы args при вызове оригинальной функции (fn.apply(this, args)).\n• Предусмотрите метод отмены (cancel) через clearTimeout."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction debounce(fn, wait) {\n  let timeout;\n  return function(...args) {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => fn.apply(this, args), wait);\n  };\n}\n```"
    }
  },
  "js165": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: Debounce откладывает выполнение до тех пор, пока не пройдет delay миллисекунд тишины после последнего вызова. Throttle гарантирует выполнение функции не чаще одного раза в указанный интервал."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Сохраняйте контекст this и аргументы args при вызове оригинальной функции (fn.apply(this, args)).\n• Предусмотрите метод отмены (cancel) через clearTimeout."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction debounce(fn, wait) {\n  let timeout;\n  return function(...args) {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => fn.apply(this, args), wait);\n  };\n}\n```"
    }
  },
  "js166": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: Debounce откладывает выполнение до тех пор, пока не пройдет delay миллисекунд тишины после последнего вызова. Throttle гарантирует выполнение функции не чаще одного раза в указанный интервал."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Сохраняйте контекст this и аргументы args при вызове оригинальной функции (fn.apply(this, args)).\n• Предусмотрите метод отмены (cancel) через clearTimeout."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction debounce(fn, wait) {\n  let timeout;\n  return function(...args) {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => fn.apply(this, args), wait);\n  };\n}\n```"
    }
  },
  "js167": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: глубокие операции над объектами требуют рекурсивного обхода свойств с проверкой типов (typeof === 'object' && val !== null) и структуры (Array vs Object)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Не забывайте про циклические ссылки (используйте WeakMap для их отслеживания).\n• Учитывайте спецтипы: Date, RegExp, Map, Set, Symbol."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction deepClone(obj, seen = new WeakMap()) {\n  if (obj === null || typeof obj !== 'object') return obj;\n  if (seen.has(obj)) return seen.get(obj);\n  const copy = Array.isArray(obj) ? [] : {};\n  seen.set(obj, copy);\n  for (const k of Object.keys(obj)) copy[k] = deepClone(obj[k], seen);\n  return copy;\n}\n```"
    }
  },
  "js168": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: глубокие операции над объектами требуют рекурсивного обхода свойств с проверкой типов (typeof === 'object' && val !== null) и структуры (Array vs Object)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Не забывайте про циклические ссылки (используйте WeakMap для их отслеживания).\n• Учитывайте спецтипы: Date, RegExp, Map, Set, Symbol."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction deepClone(obj, seen = new WeakMap()) {\n  if (obj === null || typeof obj !== 'object') return obj;\n  if (seen.has(obj)) return seen.get(obj);\n  const copy = Array.isArray(obj) ? [] : {};\n  seen.set(obj, copy);\n  for (const k of Object.keys(obj)) copy[k] = deepClone(obj[k], seen);\n  return copy;\n}\n```"
    }
  },
  "js169": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: глубокие операции над объектами требуют рекурсивного обхода свойств с проверкой типов (typeof === 'object' && val !== null) и структуры (Array vs Object)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Не забывайте про циклические ссылки (используйте WeakMap для их отслеживания).\n• Учитывайте спецтипы: Date, RegExp, Map, Set, Symbol."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction deepClone(obj, seen = new WeakMap()) {\n  if (obj === null || typeof obj !== 'object') return obj;\n  if (seen.has(obj)) return seen.get(obj);\n  const copy = Array.isArray(obj) ? [] : {};\n  seen.set(obj, copy);\n  for (const k of Object.keys(obj)) copy[k] = deepClone(obj[k], seen);\n  return copy;\n}\n```"
    }
  },
  "js170": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: глубокие операции над объектами требуют рекурсивного обхода свойств с проверкой типов (typeof === 'object' && val !== null) и структуры (Array vs Object)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Не забывайте про циклические ссылки (используйте WeakMap для их отслеживания).\n• Учитывайте спецтипы: Date, RegExp, Map, Set, Symbol."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nfunction deepClone(obj, seen = new WeakMap()) {\n  if (obj === null || typeof obj !== 'object') return obj;\n  if (seen.has(obj)) return seen.get(obj);\n  const copy = Array.isArray(obj) ? [] : {};\n  seen.set(obj, copy);\n  for (const k of Object.keys(obj)) copy[k] = deepClone(obj[k], seen);\n  return copy;\n}\n```"
    }
  },
  "js171": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Ментальная модель для «1. Шина событий (EventEmitter / PubSub)»: разбейте задачу на шаги, определите входные и выходные типы данных и выделите ключевой алгоритм или механизм JavaScript (Паттерны проектирования)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обратите внимание на крайние случаи: пустые структуры данных, передачу null/undefined, неверные типы аргументов и очистку ресурсов.\n• Убедитесь в отсутствии нежелательных мутаций и утечек памяти."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\n// Сигнатура функции:\nfunction solution(...args) {\n  // 1. Валидация входных данных\n  // 2. Основная логика\n  // 3. Возврат результата\n}\n```"
    }
  },
  "js172": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Ментальная модель для «2. Мемоизация функций с резолвером (Memoize)»: разбейте задачу на шаги, определите входные и выходные типы данных и выделите ключевой алгоритм или механизм JavaScript (Паттерны проектирования)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обратите внимание на крайние случаи: пустые структуры данных, передачу null/undefined, неверные типы аргументов и очистку ресурсов.\n• Убедитесь в отсутствии нежелательных мутаций и утечек памяти."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\n// Сигнатура функции:\nfunction solution(...args) {\n  // 1. Валидация входных данных\n  // 2. Основная логика\n  // 3. Возврат результата\n}\n```"
    }
  },
  "js173": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Ментальная модель для «3. Наблюдаемый объект (Observable / Reactive Signal)»: разбейте задачу на шаги, определите входные и выходные типы данных и выделите ключевой алгоритм или механизм JavaScript (Паттерны проектирования)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обратите внимание на крайние случаи: пустые структуры данных, передачу null/undefined, неверные типы аргументов и очистку ресурсов.\n• Убедитесь в отсутствии нежелательных мутаций и утечек памяти."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\n// Сигнатура функции:\nfunction solution(...args) {\n  // 1. Валидация входных данных\n  // 2. Основная логика\n  // 3. Возврат результата\n}\n```"
    }
  },
  "js174": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: порядок исполнения в Event Loop: Синхронный код -> Все микрозадачи (Promise.then, queueMicrotask, MutationObserver) -> Перерисовка (rAF) -> Одна макрозадача (setTimeout, setInterval, I/O) -> Снова все микрозадачи."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Тело функции-инициализатора в new Promise((resolve) => { ... }) выполняется СИНХРОННО.\n• Очередь микрозадач вычищается полностью до перехода к следующей макрозадаче."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```text\n1. Синхронные логи\n2. Микротаски (Promise.then)\n3. Макротаски (setTimeout)\n```"
    }
  },
  "js175": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: порядок исполнения в Event Loop: Синхронный код -> Все микрозадачи (Promise.then, queueMicrotask, MutationObserver) -> Перерисовка (rAF) -> Одна макрозадача (setTimeout, setInterval, I/O) -> Снова все микрозадачи."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Тело функции-инициализатора в new Promise((resolve) => { ... }) выполняется СИНХРОННО.\n• Очередь микрозадач вычищается полностью до перехода к следующей макрозадаче."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```text\n1. Синхронные логи\n2. Микротаски (Promise.then)\n3. Макротаски (setTimeout)\n```"
    }
  },
  "js179": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: порядок исполнения в Event Loop: Синхронный код -> Все микрозадачи (Promise.then, queueMicrotask, MutationObserver) -> Перерисовка (rAF) -> Одна макрозадача (setTimeout, setInterval, I/O) -> Снова все микрозадачи."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Тело функции-инициализатора в new Promise((resolve) => { ... }) выполняется СИНХРОННО.\n• Очередь микрозадач вычищается полностью до перехода к следующей макрозадаче."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```text\n1. Синхронные логи\n2. Микротаски (Promise.then)\n3. Макротаски (setTimeout)\n```"
    }
  },
  "js180": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: порядок исполнения в Event Loop: Синхронный код -> Все микрозадачи (Promise.then, queueMicrotask, MutationObserver) -> Перерисовка (rAF) -> Одна макрозадача (setTimeout, setInterval, I/O) -> Снова все микрозадачи."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Тело функции-инициализатора в new Promise((resolve) => { ... }) выполняется СИНХРОННО.\n• Очередь микрозадач вычищается полностью до перехода к следующей макрозадаче."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```text\n1. Синхронные логи\n2. Микротаски (Promise.then)\n3. Макротаски (setTimeout)\n```"
    }
  },
  "js181": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: порядок исполнения в Event Loop: Синхронный код -> Все микрозадачи (Promise.then, queueMicrotask, MutationObserver) -> Перерисовка (rAF) -> Одна макрозадача (setTimeout, setInterval, I/O) -> Снова все микрозадачи."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Тело функции-инициализатора в new Promise((resolve) => { ... }) выполняется СИНХРОННО.\n• Очередь микрозадач вычищается полностью до перехода к следующей макрозадаче."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```text\n1. Синхронные логи\n2. Микротаски (Promise.then)\n3. Макротаски (setTimeout)\n```"
    }
  },
  "js182": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: порядок исполнения в Event Loop: Синхронный код -> Все микрозадачи (Promise.then, queueMicrotask, MutationObserver) -> Перерисовка (rAF) -> Одна макрозадача (setTimeout, setInterval, I/O) -> Снова все микрозадачи."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Тело функции-инициализатора в new Promise((resolve) => { ... }) выполняется СИНХРОННО.\n• Очередь микрозадач вычищается полностью до перехода к следующей макрозадаче."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```text\n1. Синхронные логи\n2. Микротаски (Promise.then)\n3. Макротаски (setTimeout)\n```"
    }
  },
  "js183": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: порядок исполнения в Event Loop: Синхронный код -> Все микрозадачи (Promise.then, queueMicrotask, MutationObserver) -> Перерисовка (rAF) -> Одна макрозадача (setTimeout, setInterval, I/O) -> Снова все микрозадачи."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Тело функции-инициализатора в new Promise((resolve) => { ... }) выполняется СИНХРОННО.\n• Очередь микрозадач вычищается полностью до перехода к следующей макрозадаче."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```text\n1. Синхронные логи\n2. Микротаски (Promise.then)\n3. Макротаски (setTimeout)\n```"
    }
  },
  "js184": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Идея: порядок исполнения в Event Loop: Синхронный код -> Все микрозадачи (Promise.then, queueMicrotask, MutationObserver) -> Перерисовка (rAF) -> Одна макрозадача (setTimeout, setInterval, I/O) -> Снова все микрозадачи."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Тело функции-инициализатора в new Promise((resolve) => { ... }) выполняется СИНХРОННО.\n• Очередь микрозадач вычищается полностью до перехода к следующей макрозадаче."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```text\n1. Синхронные логи\n2. Микротаски (Promise.then)\n3. Макротаски (setTimeout)\n```"
    }
  },
  "js176": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Ментальная модель для «1. Мини-шаблонизатор строк (Template Engine)»: разбейте задачу на шаги, определите входные и выходные типы данных и выделите ключевой алгоритм или механизм JavaScript (Строки и Утилиты)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обратите внимание на крайние случаи: пустые структуры данных, передачу null/undefined, неверные типы аргументов и очистку ресурсов.\n• Убедитесь в отсутствии нежелательных мутаций и утечек памяти."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\n// Сигнатура функции:\nfunction solution(...args) {\n  // 1. Валидация входных данных\n  // 2. Основная логика\n  // 3. Возврат результата\n}\n```"
    }
  },
  "js177": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Ментальная модель для «2. Парсер и сериализатор URL Query String»: разбейте задачу на шаги, определите входные и выходные типы данных и выделите ключевой алгоритм или механизм JavaScript (Строки и Утилиты)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обратите внимание на крайние случаи: пустые структуры данных, передачу null/undefined, неверные типы аргументов и очистку ресурсов.\n• Убедитесь в отсутствии нежелательных мутаций и утечек памяти."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\n// Сигнатура функции:\nfunction solution(...args) {\n  // 1. Валидация входных данных\n  // 2. Основная логика\n  // 3. Возврат результата\n}\n```"
    }
  },
  "js178": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Ментальная модель для «3. Хелпер условных CSS-классов (ClassNames Polyfill)»: разбейте задачу на шаги, определите входные и выходные типы данных и выделите ключевой алгоритм или механизм JavaScript (Строки и Утилиты)."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Обратите внимание на крайние случаи: пустые структуры данных, передачу null/undefined, неверные типы аргументов и очистку ресурсов.\n• Убедитесь в отсутствии нежелательных мутаций и утечек памяти."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\n// Сигнатура функции:\nfunction solution(...args) {\n  // 1. Валидация входных данных\n  // 2. Основная логика\n  // 3. Возврат результата\n}\n```"
    }
  },
  "js196": {
    "level1": {
      "title": "Идея и ментальная модель",
      "content": "Для решения за O(n) используйте двухпроходный алгоритм через Map: на первом шаге создайте плоский словарь всех узлов по их названию (title -> { title }), а на втором шаге свяжите узлы с их родителями по ссылке."
    },
    "level2": {
      "title": "Граничные случаи и ловушки",
      "content": "• Корневые узлы (parent === null) всегда должны иметь массив children (даже пустой []).\n• У листьев (узлов без потомков) свойство children создавать не нужно.\n• Проверяйте наличие родителя (if (!parentNode) return;), чтобы избежать ошибок при битых ссылках."
    },
    "level3": {
      "title": "Псевдокод и сигнатура",
      "content": "```javascript\nconst createCategoryTree = (list) => {\n  const nodeMap = new Map();\n  list.forEach(({ title }) => nodeMap.set(title, { title }));\n  const roots = [];\n  list.forEach(({ title, parent }) => {\n    const node = nodeMap.get(title);\n    if (parent === null) {\n      node.children = node.children || [];\n      roots.push(node);\n      return;\n    }\n    const parentNode = nodeMap.get(parent);\n    if (!parentNode) return;\n    parentNode.children = parentNode.children || [];\n    parentNode.children.push(node);\n  });\n  return roots;\n};\n```"
    }
  }
};

/**
 * Get progressive hints for a given task ID.
 * Returns { level1, level2, level3 } or null if task has no custom hints.
 */
export function getTaskHints(taskId) {
  if (!taskId) return null;
  const stringId = String(taskId);
  return JS_HINTS[stringId] || null;
}

export default JS_HINTS;
