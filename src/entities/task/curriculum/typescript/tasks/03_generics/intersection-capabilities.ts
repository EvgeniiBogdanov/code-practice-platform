// Объедините два независимых набора возможностей объекта в один тип
// SerializableAndLoggable, не создавая дублирования полей, и укажите
// этот тип у переменной entity.

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
