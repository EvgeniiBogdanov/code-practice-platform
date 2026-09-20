interface User {
  age: number;
  name: string;
}

const createAndValidate = (
  name: string,
  age: number
): Partial<User> => {
  const newUser: Partial<User> = {};

  if (name.length > 0) {
    newUser.name = name;
  }

  if (age > 18) {
    newUser.age = age;
  }

  return newUser;
};
