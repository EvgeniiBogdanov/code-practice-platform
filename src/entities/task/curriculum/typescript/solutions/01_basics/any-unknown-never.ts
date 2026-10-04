const parseJson = (text: string): unknown => {
  return JSON.parse(text);
};

function fail(message: string): never {
  throw new Error(message);
}

const getUserName = (json: string): string => {
  const data = parseJson(json);

  if (
    typeof data === "object" &&
    data !== null &&
    "name" in data &&
    typeof data.name === "string"
  ) {
    return data.name.toUpperCase();
  }

  fail("В JSON нет строкового поля name");
};

getUserName('{"name": "alice"}'); // "ALICE"
