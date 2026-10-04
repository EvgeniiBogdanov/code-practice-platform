type WithId<T> = T & { id: number };

interface Repository<T extends object> {
  create(data: T): WithId<T>;
  findById(id: number): WithId<T> | undefined;
  findAll(): WithId<T>[];
}

class InMemoryRepository<T extends object> implements Repository<T> {
  #items = new Map<number, WithId<T>>();
  #nextId = 1;

  create(data: T): WithId<T> {
    // Спред generic-объекта даёт пересечение T & { id: number }.
    const entity: WithId<T> = { ...data, id: this.#nextId++ };
    this.#items.set(entity.id, entity);
    return entity;
  }

  findById(id: number): WithId<T> | undefined {
    return this.#items.get(id);
  }

  findAll(): WithId<T>[] {
    return [...this.#items.values()];
  }
}

interface UserData {
  name: string;
}

interface ProductData {
  title: string;
  price: number;
}

const users = new InMemoryRepository<UserData>();
const user = users.create({ name: "Alice" });
console.log(user.id, user.name);

const products = new InMemoryRepository<ProductData>();
products.create({ title: "Книга", price: 500 });
// products.create({ name: "Alice" }); // Ошибка: это не данные товара
// users.#items; // Ошибка: приватное поле недоступно снаружи
