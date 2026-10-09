// На основе интерфейса User создайте два новых типа:
// PublicUser — только с публичными полями (без пароля),
// RegistrationForm — только с полями, нужными для формы регистрации (имя и пароль).

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}
