import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

/**
 * Дерево обобщено по `T` и `S` и не должно ничего знать про текст. Эта регрессия
 * уже случалась: `item.ts` в какой-то момент импортировал `sumTreeSpec`, и дерево
 * перестало быть обобщённым.
 *
 * Тесты из проверки исключены осознанно: обобщённый модуль можно прогнать только
 * через какую-нибудь конкретную спеку, поэтому его тесты обязаны дотянуться до `text/`.
 */
describe('слои', () => {
  it('sumtree/ не импортирует из text/', () => {
    const sources = readdirSync(__dirname)
      .filter(f => f.endsWith('.ts') && !f.endsWith('.test.ts'));

    const offenders = sources.filter(f =>
      /from\s+['"][^'"]*\btext\b/.test(readFileSync(join(__dirname, f), 'utf8'))
    );

    expect(offenders).toEqual([]);
  });
});
