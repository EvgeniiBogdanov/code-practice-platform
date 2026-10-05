### Что делает решение
`value instanceof Constructor` **не** проверяет, каким конструктором был создан объект. Оператор проверяет, встречается ли `Constructor.prototype` где-нибудь в цепочке прототипов `value`. Полифил делает это явно:
1. Примитивы (`42`, `"строка"`, `null`, `undefined`) сразу дают `false`. У `42` есть временная обёртка `Number`, но `instanceof` её не создаёт.
2. Берём прототип значения через `Object.getPrototypeOf` и поднимаемся по цепочке.
3. Если на каком-то шаге прототип совпал с `Constructor.prototype` — возвращаем `true`.
4. Дошли до `null` (вершина цепочки) — `false`.

Для `dog` цепочка выглядит так: `dog → Dog.prototype → Animal.prototype → Object.prototype → null`. Поэтому `dog` — экземпляр и `Dog`, и `Animal`, и `Object`.

### Граничные случаи и ошибки
- `Object.create(null)` создаёт объект **без прототипа**. Он не является экземпляром `Object`, хотя это объект. Такие объекты используют как «чистые» словари.
- `instanceof` можно обмануть: если после создания объекта заменить `Constructor.prototype`, старые экземпляры перестанут проходить проверку. И наоборот: `Object.setPrototypeOf(obj, Dog.prototype)` сделает любой объект «собакой».
- **Разные realm-ы.** Массив из `iframe` создан другим конструктором `Array`, поэтому `arr instanceof Array === false`. Для массивов надёжнее `Array.isArray`.
- `Symbol.hasInstance` позволяет классу переопределить поведение `instanceof`. Полифил это не учитывает. Полная версия начинается с проверки `Constructor[Symbol.hasInstance]`.
- `Object.getPrototypeOf` вместо устаревшего `__proto__`: у объектов без прототипа свойства `__proto__` нет.

### Сложность
- По времени: `O(d)`, где `d` — глубина цепочки прототипов.
- По памяти: `O(1)`.

### Что запомнить для собеседования
- `instanceof` ищет `Constructor.prototype` в цепочке прототипов объекта.
- Для примитивов — `false`, для `Object.create(null)` и `Object` — тоже `false`.
- Массивы проверяют через `Array.isArray`, а не `instanceof`, из-за разных realm-ов.
