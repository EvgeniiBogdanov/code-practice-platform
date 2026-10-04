// Функция проверяет данные формы регистрации.
// Если все поля корректны, нужно вернуть готового пользователя.
// Если нет — сообщения об ошибках по каждому некорректному полю.
//
// Вызывающий код должен иметь доступ к user только после проверки
// успеха, а к errors — только после проверки неудачи.

interface User {
  name: string;
  age: number;
}

const validateUser = (name, age) => {
  const errors = {};

  if (name.trim().length === 0) {
    errors.name = "Имя не может быть пустым";
  }

  if (age < 18) {
    errors.age = "Пользователь должен быть совершеннолетним";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, user: { name, age } };
};

const result = validateUser("Alice", 30);
