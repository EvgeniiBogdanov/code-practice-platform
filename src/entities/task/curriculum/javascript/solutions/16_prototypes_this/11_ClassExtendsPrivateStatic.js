class BaseCounter {
  #count;

  constructor(initialValue = 0) {
    this.#count = Number(initialValue) || 0;
  }

  get value() {
    return this.#count;
  }

  increment(step = 1) {
    this.#count += step;
    return this.#count;
  }

  static getDefaultStep() {
    return 1;
  }
}

class AdvancedCounter extends BaseCounter {
  #multiplier;

  constructor(initialValue = 0, multiplier = 2) {
    super(initialValue);
    this.#multiplier = Number(multiplier) || 1;
  }

  stepUp() {
    const step = AdvancedCounter.getDefaultStep() * this.#multiplier;
    return super.increment(step);
  }

  static getVersion() {
    return "v2.0";
  }
}

// Пример вызова:
const counter = new AdvancedCounter(10, 3);
console.log(counter.value); // 10
counter.stepUp();
console.log(counter.value); // 13
console.log(AdvancedCounter.getVersion()); // 'v2.0'
console.log(AdvancedCounter.getDefaultStep()); // 1
console.log(Object.keys(counter)); // []
