/**
 * Границы размера чанка в листе — величина содержимого, не арность дерева
 * (та в `src/sumtree/constants.ts`).
 *
 * Соотношение `CHUNK_MAX = 2 * CHUNK_MIN` несущее: только при нём разрез
 * переполненного чанка пополам оставляет обе половины в границах (закон C6).
 */
export const CHUNK_MIN = 2;
export const CHUNK_MAX = CHUNK_MIN * 2;

export function* chunkify(text: string, size: number) {
  let t = '';
  for (let i = 0; i < text.length; i++) {
    if (i > 0 && i % size === 0) {
      let r = t;
      t = '';
      yield r;
    }
    t += text[i];
  }
  yield t;
}
