import { describe, expect, it } from "vitest";
import { parseSystemDesignPath } from "./parseSystemDesignPath";

describe("parseSystemDesignPath", () => {
  it("has no folder on the section overview", () => {
    expect(parseSystemDesignPath("/system-design")).toEqual({ folder: null, pageId: null });
  });

  it("finds the folder pages", () => {
    expect(parseSystemDesignPath("/system-design/topics")).toEqual({
      folder: "theory",
      pageId: null,
    });
    expect(parseSystemDesignPath("/system-design/cases/")).toEqual({
      folder: "cases",
      pageId: null,
    });
    expect(parseSystemDesignPath("/system-design/drills")).toEqual({
      folder: "drills",
      pageId: null,
    });
  });

  it("finds a topic, a case and a drill, also in the full-screen editor", () => {
    expect(parseSystemDesignPath("/system-design/topics/rendering")).toEqual({
      folder: "theory",
      pageId: "rendering",
    });
    expect(parseSystemDesignPath("/system-design/cases/chat")).toEqual({
      folder: "cases",
      pageId: "chat",
    });
    expect(parseSystemDesignPath("/system-design/sd-query-cache")).toEqual({
      folder: "drills",
      pageId: "sd-query-cache",
    });
    expect(parseSystemDesignPath("/open/system-design/sd-query-cache")).toEqual({
      folder: "drills",
      pageId: "sd-query-cache",
    });
  });
});
