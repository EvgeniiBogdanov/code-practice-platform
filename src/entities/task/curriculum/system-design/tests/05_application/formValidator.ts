// Шаг «Занятость и доход» заявки на кредит.
const incomeStep = [
  { name: "employment", rules: { required: true } },
  {
    name: "inn",
    rules: { required: true, pattern: "^\\d{12}$" },
    visibleIf: { field: "employment", equals: "self-employed" },
  },
  {
    name: "employer",
    rules: { required: true, minLength: 2, maxLength: 100 },
    visibleIf: { field: "employment", equals: "hired" },
  },
  { name: "income", rules: { required: true, min: 10000, max: 10000000 } },
  { name: "comment", rules: { maxLength: 10 } },
];

describe("правила поля", () => {
  test("заполненная форма без нарушений даёт пустой объект", () => {
    const values = { employment: "hired", employer: "Банк", income: 90000 };
    expect(validateForm(incomeStep, values)).toEqual({});
  });

  test("пустое обязательное поле — required, строка из пробелов тоже пустая", () => {
    const fields = [
      { name: "name", rules: { required: true } },
      { name: "phone", rules: { required: true } },
      { name: "docs", rules: { required: true } },
    ];
    expect(validateForm(fields, { phone: "   ", docs: [] })).toEqual({
      name: "required",
      phone: "required",
      docs: "required",
    });
  });

  test("minLength и maxLength сравнивают длину строки", () => {
    const fields = [
      { name: "short", rules: { minLength: 2 } },
      { name: "long", rules: { maxLength: 3 } },
      { name: "ok", rules: { minLength: 2, maxLength: 3 } },
    ];
    expect(validateForm(fields, { short: "a", long: "abcd", ok: "abc" })).toEqual({
      short: "minLength",
      long: "maxLength",
    });
  });

  test("pattern приходит строкой и проверяет формат", () => {
    const fields = [{ name: "inn", rules: { pattern: "^\\d{12}$" } }];
    expect(validateForm(fields, { inn: "12345" })).toEqual({ inn: "pattern" });
    expect(validateForm(fields, { inn: "123456789012" })).toEqual({});
  });

  test("min и max сравнивают число", () => {
    const fields = [{ name: "income", rules: { min: 10000, max: 100000 } }];
    expect(validateForm(fields, { income: 9999 })).toEqual({ income: "min" });
    expect(validateForm(fields, { income: 100001 })).toEqual({ income: "max" });
    expect(validateForm(fields, { income: "50000" })).toEqual({});
  });

  test("у поля остаётся первое нарушенное правило по порядку", () => {
    const fields = [{ name: "inn", rules: { minLength: 10, pattern: "^\\d+$" } }];
    expect(validateForm(fields, { inn: "ab" })).toEqual({ inn: "minLength" });
  });

  test("у необязательного пустого поля остальные правила не проверяются", () => {
    const fields = [{ name: "comment", rules: { minLength: 5, pattern: "^\\d+$" } }];
    expect(validateForm(fields, { comment: "" })).toEqual({});
    expect(validateForm(fields, { comment: "abc" })).toEqual({ comment: "minLength" });
  });
});

describe("условные поля", () => {
  test("скрытое поле не проверяется, видимое — проверяется", () => {
    expect(validateForm(incomeStep, { employment: "hired", income: 90000 })).toEqual({
      employer: "required",
    });
    expect(validateForm(incomeStep, { employment: "self-employed", income: 90000 })).toEqual({
      inn: "required",
    });
  });

  test("поле внутри скрытого блока скрыто, даже если его условие совпало", () => {
    const fields = [
      { name: "hasCoBorrower", rules: { required: true } },
      {
        name: "coBorrowerType",
        visibleIf: { field: "hasCoBorrower", equals: true },
      },
      {
        name: "coBorrowerInn",
        rules: { required: true },
        visibleIf: { field: "coBorrowerType", equals: "self-employed" },
      },
    ];
    const values = { hasCoBorrower: false, coBorrowerType: "self-employed" };
    expect(validateForm(fields, values)).toEqual({});
    expect(validateForm(fields, { ...values, hasCoBorrower: true })).toEqual({
      coBorrowerInn: "required",
    });
  });
});

describe("значения для отправки", () => {
  test("в заявку уходят только видимые поля схемы", () => {
    const values = {
      employment: "hired",
      employer: "Банк",
      inn: "123456789012",
      income: 90000,
      draftStep: "income",
    };
    expect(pickSubmitValues(incomeStep, values)).toEqual({
      employment: "hired",
      employer: "Банк",
      income: 90000,
    });
  });

  test("значения не мутируются, скрытое поле остаётся в черновике", () => {
    const values = { employment: "hired", inn: "123456789012" };
    pickSubmitValues(incomeStep, values);
    validateForm(incomeStep, values);
    expect(values).toEqual({ employment: "hired", inn: "123456789012" });
  });
});
