type Entry = [name: string, age: number];

const entry: Entry = ["Alice", 30];

const printEntry = (entry: Entry): void => {
  console.log(`${entry[0]} - ${entry[1]}`);
};
