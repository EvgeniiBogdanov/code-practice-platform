// Слияние объектов конфигурации (Shallow Merge)
// Напишите функцию mergeConfigs(defaultConfig, userConfig), которая:
// 1. Принимает два объекта defaultConfig и userConfig.
// 2. Возвращает новый объект настроек, не мутируя переданные объекты.
// 3. Свойства из userConfig перезаписывают одноименные свойства из defaultConfig.
// 4. Добавляет поле mergedAt с числовым таймстемпом Date.now().

const mergeConfigs = (defaultConfig, userConfig) => {
  // Решение тут
};

// Пример вызова:
const defaultConf = { theme: "light", fontSize: 14, analytics: { enabled: true } };
const userConf = { theme: "dark", fontSize: 16 };
const result = mergeConfigs(defaultConf, userConf);
console.log(result.theme); // 'dark'
console.log(result.fontSize); // 16
console.log(result !== defaultConf); // true
