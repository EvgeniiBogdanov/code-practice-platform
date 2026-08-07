const map = new Map([["fruit", "apple"], ["veg", "carrot"]]);

const printAll = (map) => {
  for (const [key, value] of map) {
    console.log(`${key}: ${value}`);
  }
};

printAll(map);
