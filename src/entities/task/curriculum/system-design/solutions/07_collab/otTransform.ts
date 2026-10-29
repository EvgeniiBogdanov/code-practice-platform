export type TextOp =
  | { type: "insert"; pos: number; text: string; site: string }
  | { type: "delete"; pos: number; length: number; site: string };

const applyOne = (doc: string, op: TextOp): string =>
  op.type === "insert"
    ? doc.slice(0, op.pos) + op.text + doc.slice(op.pos)
    : doc.slice(0, op.pos) + doc.slice(op.pos + op.length);

export function applyOps(doc: string, ops: readonly TextOp[]): string {
  return ops.reduce(applyOne, doc);
}

export function transform(op: TextOp, against: TextOp): TextOp[] {
  if (op.type === "insert") {
    if (against.type === "insert") {
      // Ничья в одной позиции решается одинаково на всех копиях: по site.
      const goesFirst =
        op.pos < against.pos || (op.pos === against.pos && op.site < against.site);
      return [goesFirst ? op : { ...op, pos: op.pos + against.text.length }];
    }
    if (op.pos <= against.pos) return [op];
    if (op.pos >= against.pos + against.length) return [{ ...op, pos: op.pos - against.length }];
    // Место вставки удалили: ставим текст туда, где был удалённый диапазон.
    return [{ ...op, pos: against.pos }];
  }

  const end = op.pos + op.length;
  if (against.type === "insert") {
    if (against.pos <= op.pos) return [{ ...op, pos: op.pos + against.text.length }];
    if (against.pos >= end) return [op];
    // Чужая вставка внутри удаляемого диапазона: удаляем вокруг неё, а не её саму.
    const before = against.pos - op.pos;
    return [
      { ...op, length: before },
      { ...op, pos: op.pos + against.text.length, length: op.length - before },
    ];
  }

  const againstEnd = against.pos + against.length;
  if (end <= against.pos) return [op];
  if (op.pos >= againstEnd) return [{ ...op, pos: op.pos - against.length }];
  // Общую часть уже удалили: остаётся удалить только своё.
  const overlap = Math.min(end, againstEnd) - Math.max(op.pos, against.pos);
  const length = op.length - overlap;
  return length > 0 ? [{ ...op, pos: Math.min(op.pos, against.pos), length }] : [];
}
