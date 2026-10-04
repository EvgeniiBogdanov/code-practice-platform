abstract class Employee {
  constructor(
    public name: string,
    protected salary: number
  ) {}

  abstract calculateBonus(): number;
}

class Manager extends Employee {
  calculateBonus(): number {
    return this.salary * 0.2;
  }
}

const manager = new Manager("Bob", 5000);
console.log(manager.calculateBonus());
