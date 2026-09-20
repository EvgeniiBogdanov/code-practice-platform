const obj = {
  a: 1,
  b: 2,
  c: "a",
};

const getValue = <T extends object, K extends keyof T>(
  obj: T,
  key: K
): T[K] => {
  return obj[key];
};

const res1 = getValue(obj, "a"); // number
const res2 = getValue(obj, "c"); // string
