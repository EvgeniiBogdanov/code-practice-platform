const parseQueryString = (url) => {
  if (typeof url !== "string" || !url.trim()) return {};

  const queryStringIndex = url.indexOf("?");
  const queryString = queryStringIndex !== -1 ? url.slice(queryStringIndex + 1) : url;

  if (!queryString || queryString.includes("://") || queryString.includes("/")) {
    if (queryStringIndex === -1 && (url.startsWith("http") || url.includes("/"))) {
      return {};
    }
  }

  const cleanQuery = queryString.split("#")[0];
  if (!cleanQuery) return {};

  const result = {};
  const pairs = cleanQuery.split("&");

  for (const pair of pairs) {
    if (!pair) continue;
    const eqIndex = pair.indexOf("=");
    let key, value;

    if (eqIndex === -1) {
      key = decodeURIComponent(pair);
      value = true;
    } else {
      key = decodeURIComponent(pair.slice(0, eqIndex));
      value = decodeURIComponent(pair.slice(eqIndex + 1));
    }

    if (Object.prototype.hasOwnProperty.call(result, key)) {
      if (Array.isArray(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [result[key], value];
      }
    } else {
      result[key] = value;
    }
  }

  return result;
};

const stringifyQuery = (obj) => {
  if (!obj || typeof obj !== "object") return "";
  const parts = [];

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) continue;
    const encodedKey = encodeURIComponent(key);

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== null && item !== undefined) {
          parts.push(`${encodedKey}=${encodeURIComponent(item)}`);
        }
      }
    } else {
      parts.push(`${encodedKey}=${encodeURIComponent(value)}`);
    }
  }

  return parts.join("&");
};

const parsed = parseQueryString("https://example.com?q=hello%20world&tags=js&tags=web&debug");
console.log(parsed); // { q: "hello world", tags: ["js", "web"], debug: true }

// Пример вызова:
const stringified = stringifyQuery(parsed);
console.log(stringified); // "q=hello%20world&tags=js&tags=web&debug=true"
