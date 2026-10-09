test("SerializableAndLoggable требует обе возможности", () => {
  const both: SerializableAndLoggable = { serialize: () => "data", log: () => {} };
  // @ts-expect-error
  const noLog: SerializableAndLoggable = { serialize: () => "data" };
  // @ts-expect-error
  const noSerialize: SerializableAndLoggable = { log: () => {} };
});

test("объект с обеими возможностями подходит под каждую по отдельности", () => {
  const serializable: Serializable = entity;
  const loggable: Loggable = entity;
});

test("entity имеет объединённый тип", () => {
  const both: SerializableAndLoggable = entity;
});
