test("getData принимает URL строкой", () => {
  getData(COMMENTS_URL);
  // @ts-expect-error
  getData(42);
});

test("getData возвращает промис с id и email", () => {
  getData(COMMENTS_URL).then((data) => {
    data.forEach(({ id, email }) => {
      const commentId: number = id;
      const address: string = email;
    });
  });
});

test("данные проверены: произвольные поля недоступны", () => {
  getData(COMMENTS_URL).then((data) => {
    // @ts-expect-error
    data[0].missing;
  });
});
