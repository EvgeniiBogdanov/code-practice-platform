export const safeDecodeURI = (str: string): string => {
  if (!str) return "";
  let result = str;
  try {
    while (result.includes("%")) {
      const decoded = decodeURIComponent(result);
      if (decoded === result) break;
      result = decoded;
    }
    return result;
  } catch {
    return result;
  }
};
