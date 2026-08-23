const renderTemplate = (template, data) => {
  if (typeof template !== "string") return "";
  if (!data || typeof data !== "object") return template;

  return template.replace(/{{\s*([\w.]+)\s*}}/g, (match, path) => {
    const keys = path.split(".");
    let value = data;

    for (const key of keys) {
      if (value === null || value === undefined) {
        return "";
      }
      value = value[key];
    }

    return value !== undefined && value !== null ? String(value) : "";
  });
};

const template = "Привет, {{ user.name }}! Твой баланс: {{ user.balance }}$";
const data = {
  user: {
    name: "Алексей",
    balance: 100,
  },
};

// Пример вызова:
console.log(renderTemplate(template, data)); // "Привет, Алексей! Твой баланс: 100$"
