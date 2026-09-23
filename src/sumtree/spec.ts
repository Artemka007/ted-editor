/**
 * Спецификация поведения значений типа `T` и их саммари типа `S`.
 *
 * Формально: `(S, combine, default)` — моноид, `(T, concat, empty)` — моноид,
 * а `summary` — гомоморфизм между ними. Именно гомоморфизм позволяет вычислить
 * саммари поддерева, не заглядывая в его листья, — отсюда навигация за `O(log n)`.
 *
 * Законы M1-M4 (моноид) и C1-C6 (чанкинг), а также то, что **не** гарантируется, —
 * в `docs/draft/spec.md`. Тесты законов моноида — в `src/text/spec.test.ts`.
 */
export type TreeSpec<T, S> = {
  default: () => S;
  summary: (value: T) => S;
  combine: (leftSummary: S, rightSummary: S) => S;

  size: (value: T) => number;
  concat: (a: T, b: T) => T;
  split: (value: T, at: number) => [T, T];
  maxSize: number;
}
