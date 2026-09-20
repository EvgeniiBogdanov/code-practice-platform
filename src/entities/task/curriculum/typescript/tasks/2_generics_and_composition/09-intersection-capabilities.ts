// Объедините два независимых набора возможностей объекта в один тип,
// не создавая дублирования полей.

interface Serializable {
  serialize: () => string;
}

interface Loggable {
  log: () => void;
}

const entity = {
  serialize: () => "data",
  log: () => console.log("logged"),
};
