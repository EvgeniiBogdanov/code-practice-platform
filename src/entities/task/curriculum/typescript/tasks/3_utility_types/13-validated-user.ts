interface User {
  age: number;
  name: string;
}

const createAndValidate = (name, age) => {
  const newUser = {};

  if (name.length > 0) {
    newUser.name = name;
  }

  if (age > 18) {
    newUser.age = age;
  }

  return newUser;
};
