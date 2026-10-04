// Напишите типизацию, подходящую для двух объектов.
//
// Необходимо сохранить строгую типизацию ключей внутри endpoints.
// Использование слишком общих типов для ключей не подходит.
//
// Набор ключей endpoints у каждого объекта свой. Он должен выводиться
// из самого объекта, а не дублироваться вручную в типах.

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
