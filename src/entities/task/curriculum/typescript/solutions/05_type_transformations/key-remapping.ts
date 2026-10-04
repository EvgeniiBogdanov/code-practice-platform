interface Person {
  name: string;
  age: number;
  isAdmin: boolean;
}

type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

type ChangeHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void;
};

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number; getIsAdmin: () => boolean }

type PersonPrimitives = PickByValue<Person, string | number>;
// { name: string; age: number }

const handlers: ChangeHandlers<Person> = {
  onNameChange: (value) => console.log(value.toUpperCase()),
  onAgeChange: (value) => console.log(value.toFixed(0)),
  onIsAdminChange: (value) => console.log(value ? "админ" : "пользователь"),
};
