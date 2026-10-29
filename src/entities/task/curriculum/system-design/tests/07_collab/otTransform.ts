const ins = (pos, text, site = "A") => ({ type: "insert", pos, text, site });
const del = (pos, length, site = "A") => ({ type: "delete", pos, length, site });

// Оба порядка применения должны дать один и тот же текст.
const converge = (doc, a, b) => {
  const left = applyOps(applyOps(doc, [a]), transform(b, a));
  const right = applyOps(applyOps(doc, [b]), transform(a, b));
  return { left, right };
};

describe("применение операций", () => {
  test("applyOps применяет вставки и удаления по очереди", () => {
    expect(applyOps("abc", [ins(1, "XY")])).toBe("aXYbc");
    expect(applyOps("abcdef", [del(1, 2)])).toBe("adef");
    expect(applyOps("abc", [ins(3, "!"), del(0, 1)])).toBe("bc!");
    expect(applyOps("abc", [])).toBe("abc");
  });
});

describe("вставка против вставки", () => {
  test("вставка до чужой не сдвигается, после — сдвигается", () => {
    expect(transform(ins(1, "X"), ins(3, "YY", "B"))).toEqual([ins(1, "X")]);
    expect(transform(ins(4, "X"), ins(1, "YY", "B"))).toEqual([ins(6, "X")]);
  });

  test("в одну позицию первой идёт вставка с меньшим site", () => {
    expect(transform(ins(2, "A", "A"), ins(2, "B", "B"))).toEqual([ins(2, "A", "A")]);
    expect(transform(ins(2, "B", "B"), ins(2, "A", "A"))).toEqual([ins(3, "B", "B")]);
    const { left, right } = converge("....", ins(2, "A", "A"), ins(2, "B", "B"));
    expect(left).toBe("..AB..");
    expect(right).toBe("..AB..");
  });
});

describe("вставка и удаление", () => {
  test("вставка после удалённого диапазона сдвигается назад", () => {
    expect(transform(ins(6, "X"), del(1, 3, "B"))).toEqual([ins(3, "X")]);
    expect(transform(ins(1, "X"), del(1, 3, "B"))).toEqual([ins(1, "X")]);
  });

  test("вставка внутрь удалённого диапазона переезжает в его начало", () => {
    expect(transform(ins(3, "X"), del(1, 4, "B"))).toEqual([ins(1, "X")]);
  });

  test("удаление вокруг чужой вставки делится на два", () => {
    const parts = transform(del(1, 3), ins(2, "X", "B"));
    expect(parts.length).toBe(2);
    expect(applyOps("abXcdef", parts)).toBe("aXef");
  });

  test("удаление сдвигается вставкой перед ним и не меняется от вставки после", () => {
    expect(transform(del(2, 2), ins(0, "XYZ", "B"))).toEqual([del(5, 2)]);
    expect(transform(del(2, 2), ins(4, "X", "B"))).toEqual([del(2, 2)]);
  });
});

describe("удаление против удаления", () => {
  test("непересекающиеся удаления только сдвигаются", () => {
    expect(transform(del(5, 2), del(0, 2, "B"))).toEqual([del(3, 2)]);
    expect(transform(del(0, 2), del(5, 2, "B"))).toEqual([del(0, 2)]);
  });

  test("пересечение не удаляется дважды", () => {
    expect(transform(del(1, 3), del(2, 4, "B"))).toEqual([del(1, 1)]);
    expect(applyOps("abcdefgh", [del(2, 4, "B"), ...transform(del(1, 3), del(2, 4, "B"))])).toBe(
      "agh"
    );
  });

  test("поглощённое удаление превращается в пустой массив", () => {
    expect(transform(del(2, 2), del(1, 5, "B"))).toEqual([]);
  });
});

describe("сходимость", () => {
  test("любые две одновременные правки сводятся к одному тексту", () => {
    const doc = "abcdefgh";
    const variants = (site) => [
      ins(0, "X", site),
      ins(3, "XY", site),
      ins(8, "Z", site),
      del(0, 2, site),
      del(2, 3, site),
      del(4, 4, site),
      del(1, 6, site),
    ];
    const failures = [];
    for (const a of variants("A")) {
      for (const b of variants("B")) {
        const { left, right } = converge(doc, a, b);
        if (left !== right) failures.push(`${JSON.stringify(a)} + ${JSON.stringify(b)}`);
      }
    }
    expect(failures).toEqual([]);
  });
});
