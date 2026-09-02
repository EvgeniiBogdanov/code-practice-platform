### Что делает решение
Решение использует метод `Object.defineProperty` для точечной настройки флагов дескриптора свойств (`Property Descriptors`), защищая объект от несанкционированной модификации, скрывая конфиденциальные токены от перечисления и настраивая контролируемые аксессоры (get/set).

### Пошаговый разбор флагов дескриптора

| Флаг | Значение по умолчанию в `Object.defineProperty` | Значение при обычном `obj.prop = val` | Эффект при `false` |
|---|---|---|---|
| **`writable`** | `false` | `true` | Запрет изменения значения свойства (`obj.id = 200` бросит `TypeError` в strict mode). |
| **`enumerable`** | `false` | `true` | Свойство не попадает в `for...in`, `Object.keys()` и `JSON.stringify()`. |
| **`configurable`** | `false` | `true` | Свойство нельзя удалить (`delete obj.id === false`) и его дескриптор нельзя переопределить. |

### Аксессоры (Getters & Setters)
- Свойства доступа (Accessor Properties) содержат методы `get` и `set` вместо `value` и `writable`.
- Попытка указать одновременно `value` и `get` в одном дескрипторе вызовет `TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute`.

### Граничные случаи и ошибки
- **Значения по умолчанию в `Object.defineProperty`**: если флаги не указаны явно, они автоматически равны `false`! (В литерале `{ a: 1 }` они по умолчанию равны `true`).
- **`Object.getOwnPropertyDescriptor(obj, prop)`**: позволяет проинспектировать текущие флаги любого свойства.

### Сложность
- **По времени**: `O(1)` для создания дескриптора и доступа.
- **По памяти**: `O(1)`.

### Что запомнить для собеседования
- `Object.defineProperty` по умолчанию ставит все флаги в `false`.
- `enumerable: false` скрывает свойство из `Object.keys()` и `JSON.stringify()`, но оставляет доступным по прямому чтению `obj.secret`.
- `configurable: false` делает удаление свойства невозможным навсегда.
