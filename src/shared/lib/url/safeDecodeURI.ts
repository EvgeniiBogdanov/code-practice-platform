export const safeDecodeURI = (str: string): string => {
  if (!str) return "";
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
};
