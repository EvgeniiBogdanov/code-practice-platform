const extractAccountSummary = (payload = {}) => {
  const {
    account: {
      id: accountId = "anonymous",
      user: { firstName = "", lastName = "" } = {},
    } = {},
    contacts: {
      emails: [primaryEmail = "no-email"] = [],
    } = {},
    plan = "free",
    ...meta
  } = payload || {};

  const nameParts = [firstName, lastName].filter(Boolean);
  const fullName = nameParts.length > 0 ? nameParts.join(" ") : "Guest User";

  return {
    accountId,
    fullName,
    primaryEmail,
    plan,
    meta,
  };
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
