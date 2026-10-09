test("базовый класс Employee нельзя создать напрямую", () => {
  // @ts-expect-error
  new Employee("Alice", 1000);
});

test("Manager создаётся и считает премию", () => {
  const manager = new Manager("Bob", 5000);
  const name: string = manager.name;
  const bonus: number = manager.calculateBonus();
});

test("зарплата недоступна снаружи класса", () => {
  const manager = new Manager("Bob", 5000);
  // @ts-expect-error
  manager.salary;
});

test("наследник обязан реализовать calculateBonus и видит зарплату", () => {
  class Developer extends Employee {
    calculateBonus(): number {
      return this.salary * 0.1;
    }
  }
  // @ts-expect-error
  class Intern extends Employee {}
});
