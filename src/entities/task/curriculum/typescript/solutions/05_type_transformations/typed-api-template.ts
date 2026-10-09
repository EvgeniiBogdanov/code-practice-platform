type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface Endpoint {
  method: HttpMethod;
  url: string;
}

interface ApiObject<K extends string> {
  entity: string;
  endpoints: {
    [P in K]: Endpoint;
  };
}

// K выводится из ключей переданного объекта endpoints.
const defineApi = <K extends string>(api: ApiObject<K>): ApiObject<K> => api;

const vtemplateObject = defineApi({
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
});

const reportObject = defineApi({
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
});

reportObject.endpoints.getReports.method; // HttpMethod
// reportObject.endpoints.getVtemplates — ошибка: такого endpoint нет (проверяется в tests.ts)
