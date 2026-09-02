const mergeConfigs = (defaultConfig = {}, userConfig = {}) => {
  return {
    ...defaultConfig,
    ...userConfig,
    mergedAt: Date.now(),
  };
};

// Пример вызова:
const defaultConf = {
  theme: "light",
  fontSize: 14,
  analytics: { enabled: true, trackingId: "UA-0000" },
};

const userConf = {
  theme: "dark",
  fontSize: 16,
};

const result = mergeConfigs(defaultConf, userConf);
console.log(result.theme);                      // 'dark'
console.log(result.fontSize);                   // 16
console.log(result.analytics.enabled);          // true
console.log(typeof result.mergedAt);            // 'number'
console.log(result !== defaultConf);            // true
console.log(result.analytics === defaultConf.analytics); // true
