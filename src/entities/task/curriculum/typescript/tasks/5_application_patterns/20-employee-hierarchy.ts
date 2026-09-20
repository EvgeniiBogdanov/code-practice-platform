// Создайте структуру классов для сотрудников компании.
// У каждого сотрудника есть имя и зарплата (доступна только внутри
// класса и его наследников).
// Метод расчёта премии должен быть обязательным для реализации
// в каждом конкретном виде сотрудника, но сам базовый класс
// нельзя создавать напрямую.

class Employee {
  name;
  salary;

  constructor(name, salary) {
    this.name = name;
    this.salary = salary;
  }

  calculateBonus() {
    return 0;
  }
}

class Manager extends Employee {
  calculateBonus() {
    return this.salary * 0.2;
  }
}
