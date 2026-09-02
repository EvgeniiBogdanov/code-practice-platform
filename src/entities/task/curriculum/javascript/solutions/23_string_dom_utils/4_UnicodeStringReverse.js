const reverseUnicodeString = (str) => {
  if (typeof str !== "string") {
    return "";
  }

  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    const segments = [...segmenter.segment(str)].map((s) => s.segment);
    return segments.reverse().join("");
  }

  // Fallback для сред без Intl.Segmenter (Array.from поддерживает суррогатные пары)
  return Array.from(str).reverse().join("");
};

// Пример вызова:
console.log(reverseUnicodeString("hello")); // 'olleh'
console.log(reverseUnicodeString("foo 🚀 bar")); // 'rab 🚀 oof'
console.log(reverseUnicodeString("👋 Привет 🌍")); // '🌍 тевирП 👋'

// Демонстрация проблемы split(''):
console.log("👋".split("").reverse().join("")); // '' (сломанная пара)
console.log(reverseUnicodeString("👋")); // '👋' (целый эмодзи)
