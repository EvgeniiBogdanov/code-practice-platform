// С помощью переименования ключей в отображаемых типах реализуйте:
//
// Getters<T>        — для каждого поля метод get + ИмяПоля:
//                     { name: string } → { getName: () => string }
// PickByValue<T, V> — только поля, значения которых совместимы с V;
// ChangeHandlers<T> — для каждого поля on + ИмяПоля + Change:
//                     { name: string } → { onNameChange: (value: string) => void }

interface Person {
  name: string;
  age: number;
  isAdmin: boolean;
}

type Getters<T> = unknown;
type PickByValue<T, V> = unknown;
type ChangeHandlers<T> = unknown;

// Getters<Person>
//   → { getName: () => string; getAge: () => number; getIsAdmin: () => boolean }
// PickByValue<Person, string | number>
//   → { name: string; age: number }
// ChangeHandlers<Person>
//   → { onNameChange: (value: string) => void; onAgeChange: ...; onIsAdminChange: ... }
