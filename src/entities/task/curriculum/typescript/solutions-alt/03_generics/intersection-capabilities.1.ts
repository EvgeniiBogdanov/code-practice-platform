// Альтернативный эталон: интерфейс, расширяющий оба набора возможностей.
interface Serializable {
  serialize: () => string;
}

interface Loggable {
  log: () => void;
}

interface SerializableAndLoggable extends Serializable, Loggable {}

const entity: SerializableAndLoggable = {
  serialize: () => "data",
  log: () => console.log("logged"),
};
