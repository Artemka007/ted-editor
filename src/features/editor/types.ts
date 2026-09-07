export type TextSummary = {
  /** Characters count */
  len: number,
  /** A point representing the number of lines and the length of the last line */
  linesCount: number;
  /** How many `char`s are in the first line */
  firstLineChars: number,
  /** How many `char`s are in the last line */
  lastLineChars: number,
  /** The row idx of the longest row */
  longestRow: number,
  /** How many `char`s are in the longest row */
  longestRowChars: number,
}

export type ISumTree<T, S> = {
  open(cfileName: string): void;
}

/**
 * An interface describing accumulation functions over a SumTree.
 * T is type of the node value, S is summary, 
 */
export type TreeSpec<V, S> = {
  default: () => S;
  summary: (value: V) => S;
  combine: (leftSumary: S, rightSummary: S) => S;
}

export type Item = {
  type: ItemType.INTERNAL;
  get height(): number;
  get childSummaries(): TextSummary[];
  get childTrees(): ISumTree<Item, TextSummary>[];
} | {
  type: ItemType.LEAF;
  get summary(): TextSummary;
  get value(): string;
}

export type Point = {
  row: number;
  col: number;
}
