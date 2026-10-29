// Двое правят один текст одновременно. Каждый сразу применил свою операцию, а потом получил
// чужую. Чужую нельзя применить как есть: её позиция посчитана для текста без вашей правки.
// Operational Transformation переписывает операцию так, чтобы у обоих получился один текст.
//
// Операции: { type: "insert", pos, text, site } и { type: "delete", pos, length, site }.
//
// Реализуйте applyOps(doc, ops) и transform(op, against):
// - applyOps применяет операции по очереди и возвращает новый текст;
// - transform(op, against) возвращает массив операций: op, переписанный так, чтобы применяться
//   после against (against уже применена к тексту);
// - вставка до места чужой правки не сдвигается, после — сдвигается на длину чужой правки;
// - две вставки в одну позицию: первой стоит вставка с меньшим site (сравнение строк);
// - вставка внутрь чужого удалённого диапазона переезжает в его начало: введённый текст не теряется;
// - удаление, внутрь которого попала чужая вставка, делится на два, чтобы вставка уцелела;
// - пересекающиеся удаления не удаляют один символ дважды; удаление, которое целиком
//   удалили раньше, превращается в пустой массив;
// - главное свойство (сходимость): для любых a и b
//   applyOps(applyOps(doc, [a]), transform(b, a)) === applyOps(applyOps(doc, [b]), transform(a, b)).

export type TextOp =
  | { type: "insert"; pos: number; text: string; site: string }
  | { type: "delete"; pos: number; length: number; site: string };

export function applyOps(doc: string, ops: readonly TextOp[]): string {
  return doc;
}

export function transform(op: TextOp, against: TextOp): TextOp[] {
  return [op];
}
