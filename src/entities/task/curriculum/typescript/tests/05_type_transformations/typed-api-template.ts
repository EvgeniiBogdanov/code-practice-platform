test("ключи endpoints выводятся из объекта", () => {
  type _ = Expect<Equal<keyof typeof reportObject.endpoints, "getReports" | "putReports">>;
  type __ = Expect<
    Equal<keyof typeof vtemplateObject.endpoints, "getVtemplates" | "postVtemplates">
  >;
});

test("у каждого объекта только свои endpoint", () => {
  const url: string = reportObject.endpoints.getReports.url;
  const postUrl: string = vtemplateObject.endpoints.postVtemplates.url;
  // @ts-expect-error
  reportObject.endpoints.getVtemplates;
  // @ts-expect-error
  vtemplateObject.endpoints.getReports;
});

test("method — не произвольная строка", () => {
  const method = reportObject.endpoints.getReports.method;
  type _ = Expect<Equal<string extends typeof method ? true : false, false>>;
});
