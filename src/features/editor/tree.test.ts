import { sumTreeSpec } from './tree';

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

describe('Check monoid axioms', () => {
  it('default should return zero values', () => {
    expect(sumTreeSpec.default().len).toBe(0);
    expect(sumTreeSpec.default().firstLineChars).toBe(0);
    expect(sumTreeSpec.default().lastLineChars).toBe(0);
    expect(sumTreeSpec.default().linesCount).toBe(0);
    expect(sumTreeSpec.default().longestRow).toBe(0);
    expect(sumTreeSpec.default().longestRowChars).toBe(0);
  });
  it('summary should to be associative ((a+b)+c == a+(b+c))', () => {
    expect(sumTreeSpec.combine(sumTreeSpec.combine(summaries[0], summaries[1]), summaries[2]))
      .toEqual(sumTreeSpec.combine(summaries[0], sumTreeSpec.combine(summaries[1], summaries[2])));
  });
  it('empty string equals default string', () => {
    expect(sumTreeSpec.summary(emptyString)).toEqual(sumTreeSpec.default());
  });
  it('combine with default should give initial summary', () => {
    expect(sumTreeSpec.combine(summaries[0], sumTreeSpec.default())).toEqual(summaries[0]);
    expect(sumTreeSpec.combine(sumTreeSpec.default(), summaries[0])).toEqual(summaries[0]);
  });
  it.each(strings.flatMap(a => strings.map(b => [a, b])))(
    'homomorphism: summary(%j + %j)',
    (a, b) => { 
      expect(sumTreeSpec.summary(a + b))
        .toEqual(sumTreeSpec.combine(sumTreeSpec.summary(a), sumTreeSpec.summary(b)));
    }
  );
})
