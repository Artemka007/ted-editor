import { sumTreeSpec } from './spec';

const simpleString = 'Hell\no wor\nld\n!';
const emptyString = '';
const longRow = 'r'.repeat(1000);
const longCol = '\n'.repeat(1000);

const strings = [
  simpleString,
  emptyString,
  longRow,
  longCol
];

const summaries = strings.map(sumTreeSpec.summary);

/**
 * Законы интерфейса `TreeSpec`. Идентификаторы M1-M4 — из `docs/draft/spec.md`.
 * Проверяются на `sumTreeSpec` как на представителе: любая другая спека обязана
 * удовлетворять тем же законам.
 */
describe('TreeSpec: законы моноида', () => {
  it('M1: нейтральный элемент — combine(s, default()) = combine(default(), s) = s', () => {
    expect(sumTreeSpec.combine(summaries[0], sumTreeSpec.default())).toEqual(summaries[0]);
    expect(sumTreeSpec.combine(sumTreeSpec.default(), summaries[0])).toEqual(summaries[0]);
  });

  it('M2: ассоциативность — combine(combine(a, b), c) = combine(a, combine(b, c))', () => {
    expect(sumTreeSpec.combine(sumTreeSpec.combine(summaries[0], summaries[1]), summaries[2]))
      .toEqual(sumTreeSpec.combine(summaries[0], sumTreeSpec.combine(summaries[1], summaries[2])));
  });

  it.each(strings.flatMap(a => strings.map(b => [a, b])))(
    'M3: гомоморфизм — summary(concat(%j, %j)) = combine(summary(a), summary(b))',
    (a, b) => {
      expect(sumTreeSpec.summary(sumTreeSpec.concat(a, b)))
        .toEqual(sumTreeSpec.combine(sumTreeSpec.summary(a), sumTreeSpec.summary(b)));
    }
  );

  it('M4: пустое значение — summary(empty) = default()', () => {
    expect(sumTreeSpec.summary(emptyString)).toEqual(sumTreeSpec.default());
  });
});

/**
 * Свойства конкретной реализации `sumTreeSpec`, а не законы интерфейса.
 * Другая спека вправе вести себя иначе.
 */
describe('sumTreeSpec: свойства реализации', () => {
  it('default() возвращает нули по всем полям', () => {
    expect(sumTreeSpec.default()).toEqual({
      len: 0,
      firstLineChars: 0,
      lastLineChars: 0,
      linesCount: 0,
      longestRow: 0,
      longestRowChars: 0,
    });
  });
});
