import { describe, expect, it } from "vitest";
import { pluralizeRu } from "./pluralizeRu";

const forms = ["тест", "теста", "тестов"] as const;

describe("pluralizeRu", () => {
  it("chooses one, few and many forms", () => {
    expect(pluralizeRu(1, forms)).toBe("тест");
    expect(pluralizeRu(2, forms)).toBe("теста");
    expect(pluralizeRu(5, forms)).toBe("тестов");
    expect(pluralizeRu(11, forms)).toBe("тестов");
    expect(pluralizeRu(21, forms)).toBe("тест");
    expect(pluralizeRu(0, forms)).toBe("тестов");
  });
});
