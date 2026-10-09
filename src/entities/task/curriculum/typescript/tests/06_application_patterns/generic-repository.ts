test("Repository — контракт, который реализует InMemoryRepository", () => {
  const repository: Repository<{ name: string }> = new InMemoryRepository<{ name: string }>();
});

test("create возвращает сущность с присвоенным id", () => {
  const repository = new InMemoryRepository<{ name: string }>();
  const created = repository.create({ name: "Alice" });
  const id: number = created.id;
  const name: string = created.name;
});

test("findById и findAll возвращают сущности того же типа", () => {
  const repository = new InMemoryRepository<{ name: string }>();
  const found = repository.findById(1);
  const name: string | undefined = found?.name;
  const all: { name: string; id: number }[] = repository.findAll();
});

test("create принимает только данные своей сущности без id", () => {
  const repository = new InMemoryRepository<{ name: string }>();
  // @ts-expect-error
  repository.create({ title: "Книга" });
  // @ts-expect-error
  repository.create({ name: "Alice", id: 5 });
});

test("внутреннее хранилище и счётчик недоступны снаружи", () => {
  const repository = new InMemoryRepository<{ name: string }>();
  // @ts-expect-error
  repository.items;
  // @ts-expect-error
  repository.nextId;
});
