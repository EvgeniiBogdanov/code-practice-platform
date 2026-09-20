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

type VtemplateObject = ApiObject<
  "getVtemplates" | "postVtemplates"
>;

type ReportObject = ApiObject<
  "getReports" | "putReports"
>;

const vtemplateObject: VtemplateObject = {
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

const reportObject: ReportObject = {
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
