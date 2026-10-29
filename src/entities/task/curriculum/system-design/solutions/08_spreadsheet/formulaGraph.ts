export type CellValue = number | "#CYCLE";

export interface Sheet {
  setValue: (id: string, value: number) => string[];
  setFormula: (
    id: string,
    deps: readonly string[],
    compute: (values: number[]) => number
  ) => string[];
  get: (id: string) => CellValue | undefined;
}

interface Formula {
  deps: readonly string[];
  compute: (values: number[]) => number;
}

const CYCLE = "#CYCLE";

export function createSheet(): Sheet {
  const values = new Map<string, CellValue>();
  const formulas = new Map<string, Formula>();
  // Обратные ссылки: ячейка → формулы, которые её читают.
  const dependents = new Map<string, Set<string>>();

  const unlink = (id: string): void => {
    const deps = formulas.get(id)?.deps ?? [];
    for (const dep of deps) dependents.get(dep)?.delete(id);
    formulas.delete(id);
  };

  const link = (id: string, formula: Formula): void => {
    formulas.set(id, formula);
    for (const dep of formula.deps) {
      const readers = dependents.get(dep) ?? new Set<string>();
      readers.add(id);
      dependents.set(dep, readers);
    }
  };

  const evaluate = (id: string): void => {
    const { deps, compute } = formulas.get(id)!;
    const args = deps.map((dep) => values.get(dep) ?? 0);
    const isBroken = args.some((value) => value === CYCLE);
    values.set(id, isBroken ? CYCLE : compute(args as number[]));
  };

  const recalc = (changed: string): string[] => {
    // 1. Все формулы, которых достигает изменение (обход без рекурсии: цепочки бывают длинными).
    const affected = new Set<string>(formulas.has(changed) ? [changed] : []);
    const stack = [changed];
    while (stack.length > 0) {
      for (const reader of dependents.get(stack.pop()!) ?? []) {
        if (affected.has(reader)) continue;
        affected.add(reader);
        stack.push(reader);
      }
    }

    // 2. Топологический порядок (Кан): формула готова, когда посчитаны все её зависимости.
    const waiting = new Map<string, number>();
    for (const id of affected) {
      const inside = new Set(formulas.get(id)!.deps.filter((dep) => affected.has(dep)));
      waiting.set(id, inside.size);
    }
    const ready = [...affected].filter((id) => waiting.get(id) === 0);
    const order: string[] = [];
    while (ready.length > 0) {
      const id = ready.shift()!;
      evaluate(id);
      order.push(id);
      for (const reader of dependents.get(id) ?? []) {
        if (!affected.has(reader)) continue;
        const left = waiting.get(reader)! - 1;
        waiting.set(reader, left);
        if (left === 0) ready.push(reader);
      }
    }

    // 3. Кто так и не дождался своих зависимостей — в цикле или за ним.
    const done = new Set(order);
    for (const id of affected) if (!done.has(id)) values.set(id, CYCLE);
    return order;
  };

  return {
    setValue: (id, value) => {
      unlink(id);
      values.set(id, value);
      return recalc(id);
    },
    setFormula: (id, deps, compute) => {
      unlink(id);
      link(id, { deps: [...deps], compute });
      return recalc(id);
    },
    get: (id) => values.get(id),
  };
}
