/**
 * Напишите функции parseQueryString(url) и stringifyQuery(obj) для работы с Query String.
 *
 * Подгруппа: Парсинг URL
 *
 * 1. parseQueryString(url):
 *    - Принимает полный URL или только строку параметров (например, "?foo=bar&page=1" или "https://site.com?foo=bar")
 *    - Возвращает объект с распарсенными параметрами
 *    - Декодирует спецсимволы (decodeURIComponent)
 *    - Если ключ встречается несколько раз (например, "tags=js&tags=react"), значение должно стать массивом ['js', 'react']
 *    - Если значение отсутствует (например, "?flag"), значением ключа становится true
 *
 * 2. stringifyQuery(obj):
 *    - Принимает объект с параметрами и формирует строку query string (без начального '?')
 *    - Кодирует спецсимволы (encodeURIComponent)
 *    - Массивы превращает в повторяющиеся ключи (например, { tags: ['js', 'react'] } -> "tags=js&tags=react")
 *    - Игнорирует ключи со значением undefined или null
 *
 * @param {string} url
 * @returns {Object}
 */
function parseQueryString(url) {
  // Ваш код здесь
}

/**
 * @param {Object} obj
 * @returns {string}
 */
function stringifyQuery(obj) {
  // Ваш код здесь
}

// Примеры использования:
const url = 'https://example.com/search?q=hello%20world&tags=js&tags=web&debug';
const parsed = parseQueryString(url);
console.log(parsed);
// Вывод: { q: 'hello world', tags: ['js', 'web'], debug: true }

const stringified = stringifyQuery(parsed);
console.log(stringified);
// Вывод: 'q=hello%20world&tags=js&tags=web&debug=true'
