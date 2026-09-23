/**
 * Как свернуть саммари в координату, по которой ведётся навигация по дереву.
 *
 * Спуск корректен только если `addSummary` монотонна по `compare` и согласована
 * с `combine` спеки: `addSummary(addSummary(z, s1), s2) === addSummary(z, combine(s1, s2))`.
 * Без этого саммари узла нельзя использовать вместо обхода его листьев.
 */
export interface Dimension<S, D> {
  zero: () => D;
  addSummary: (acc: D, summary: S) => D;
  compare: (next: D, target: D) => number;
}
