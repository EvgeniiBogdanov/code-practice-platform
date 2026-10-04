// Опишите контракт хранилища Repository и реализуйте его
// классом InMemoryRepository.
//
// - Один и тот же класс должен работать и для пользователей, и для товаров.
// - create принимает данные без id и возвращает сущность с присвоенным id.
// - findById и findAll возвращают сущности того же типа.
// - Внутреннее хранилище и счётчик id недоступны снаружи — ни при проверке
//   типов, ни во время выполнения.

class InMemoryRepository {
  items = new Map();
  nextId = 1;

  create(data) {
    const entity = { ...data, id: this.nextId++ };
    this.items.set(entity.id, entity);
    return entity;
  }

  findById(id) {
    return this.items.get(id);
  }

  findAll() {
    return [...this.items.values()];
  }
}

const users = new InMemoryRepository();
const user = users.create({ name: "Alice" });
console.log(user.id, user.name);

const products = new InMemoryRepository();
products.create({ title: "Книга", price: 500 });
