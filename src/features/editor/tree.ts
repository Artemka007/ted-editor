import { Internal } from "./item";
import { TreeSpec, Item, ISumTree, TextSummary } from "./types";

export const sumTreeSpec: TreeSpec<String, TextSummary> = {
  default: () => ({
      len: 0,
      firstLineChars: 0,
      lastLineChars: 0,
      linesCount: 0,
      longestRow: 0,
      longestRowChars: 0,
  }),
  summary: (value) => {
    const rows = value.split('\n');
    const mx = Math.max(...rows.map(i => i.length));

    return {
      len: value.length,
      firstLineChars: rows[0].length,
      lastLineChars: rows[rows.length - 1].length,
      linesCount: rows.length - 1,
      longestRowChars: mx,
      longestRow: rows.findIndex(i => i.length === mx) || 0
    };
  },
  combine: (leftSummary, rightSummary) => {
    const middleLineLenChars = leftSummary.lastLineChars + rightSummary.firstLineChars;
    return {
      len: leftSummary.len + rightSummary.len,
      linesCount: leftSummary.linesCount + rightSummary.linesCount,
      firstLineChars: leftSummary.firstLineChars + (leftSummary.linesCount === 0 ? rightSummary.firstLineChars : 0),
      lastLineChars: rightSummary.lastLineChars + (rightSummary.linesCount === 0 ? leftSummary.lastLineChars : 0),
      longestRow: middleLineLenChars > leftSummary.longestRowChars && middleLineLenChars > rightSummary.longestRowChars 
        ? leftSummary.linesCount
        : leftSummary.longestRowChars >= rightSummary.longestRowChars 
          ? leftSummary.longestRow
          : rightSummary.longestRow + leftSummary.linesCount,
      longestRowChars: Math.max(
        leftSummary.longestRowChars, 
        rightSummary.longestRowChars, 
        middleLineLenChars
      ),
    }
  }
}

export class SumTree<T, S, V> implements ISumTree<S, T> {
  // private _root: T;
  private _spec: TreeSpec<V, S>;
  private _root: Item;

  constructor(spec: TreeSpec<V, S>) {
    this._spec = spec;
    this._root = new Internal();
  }

  open(fileName: string): void {
    
  }

  private _appendChunk(chunk: string) {

  }
}