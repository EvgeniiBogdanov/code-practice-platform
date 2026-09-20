// Напишите типизацию, подходящую для двух объектов.
//
// Необходимо сохранить строгую типизацию ключей внутри endpoints.
// Использование слишком общих типов для ключей не подходит.
//
// Считайте, что набор ключей endpoints известен на этапе
// типизации каждого конкретного объекта.

const vtemplateObject = {
  entity: "vtemplate",
  endpoints: {
    getVtemplates: {
      method: "GET",
      url: "vtemplate",
    },
    postVtemplates: {
      method: "POST",
      url: "vtemplate",
    },
  },
};

const reportObject = {
  entity: "report",
  endpoints: {
    getReports: {
      method: "GET",
      url: "report",
    },
    putReports: {
      method: "PUT",
      url: "report",
    },
  },
};
