// Глубокая вложенная деструктуризация (Defaults, Rename, Rest)
// Реализуйте функцию extractAccountSummary(payload = {}), извлекающую нормализованные данные из сложного API-пейлоада:
// 1. Из payload.account извлечь id с переименованием в accountId (по умолчанию "anonymous").
// 2. Из payload.account.user извлечь firstName и lastName (дефолты пустые строки) и сформировать fullName (или "Guest User", если имя не задано).
// 3. Из payload.contacts.emails извлечь первый email как primaryEmail (дефолт "no-email").
// 4. Извлечь plan (дефолт "free").
// 5. Все остальные поля верхнего уровня собрать в meta через ...meta.
// 6. Безопасно обрабатывать отсутствующие вложенные объекты и null.

const extractAccountSummary = (payload = {}) => {
  // Решение тут
};

// Пример вызова:
const payload1 = {
  account: {
    id: "acc_101",
    user: { firstName: "Иван", lastName: "Петров" },
  },
  contacts: {
    emails: ["ivan@work.com", "ivan@personal.com"],
  },
  plan: "premium",
  region: "eu-central",
  version: 2,
};

console.log(extractAccountSummary(payload1));
// {
//   accountId: 'acc_101',
//   fullName: 'Иван Петров',
//   primaryEmail: 'ivan@work.com',
//   plan: 'premium',
//   meta: { region: 'eu-central', version: 2 }
// }

console.log(extractAccountSummary({}));
// {
//   accountId: 'anonymous',
//   fullName: 'Guest User',
//   primaryEmail: 'no-email',
//   plan: 'free',
//   meta: {}
// }
