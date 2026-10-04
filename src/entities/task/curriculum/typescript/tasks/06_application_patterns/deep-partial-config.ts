// Функция обновления конфигурации должна принимать объект,
// в котором можно указать произвольные поля на любом уровне
// вложенности, не указывая при этом остальные поля — как на
// верхнем уровне, так и внутри вложенных объектов.

interface AppConfig {
  theme: {
    color: string;
    fontSize: number;
  };
  features: {
    darkMode: boolean;
    beta: {
      enabled: boolean;
    };
  };
}

const updateConfig = (current, updates) => {
  return { ...current, ...updates };
};
