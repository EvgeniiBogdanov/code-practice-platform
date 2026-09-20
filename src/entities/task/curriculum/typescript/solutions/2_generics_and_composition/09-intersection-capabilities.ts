interface Serializable {
  serialize: () => string;
}

interface Loggable {
  log: () => void;
}

type SerializableAndLoggable = Serializable & Loggable;

const entity: SerializableAndLoggable = {
  serialize: () => "data",
  log: () => console.log("logged"),
};
