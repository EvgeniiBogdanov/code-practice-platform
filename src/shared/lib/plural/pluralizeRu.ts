const rules = new Intl.PluralRules("ru");

/** Picks the Russian form for `count`: `pluralizeRu(2, ["тест", "теста", "тестов"])`. */
export const pluralizeRu = (
  count: number,
  [one, few, many]: readonly [string, string, string]
): string => {
  const category = rules.select(Math.abs(count));
  return category === "one" ? one : category === "few" ? few : many;
};
