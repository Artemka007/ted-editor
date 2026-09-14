import { InternalItem, LeafItem } from "./interfaces";

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

/**
 * An interface describing accumulation functions over a SumTree.
 * T is type of the node value, S is summary, 
 */
export type TreeSpec<T, S> = {
  default: () => S;
  summary: (value: T) => S;
  combine: (leftSumary: S, rightSummary: S) => S;

  size: (value: T) => number;
  concat: (a: T, b: T) => T;
  split: (value: T, at: number) => [T, T];
  maxSize: number;
}

export type Point = {
  row: number;
  col: number;
}

export type Item<T, S> = InternalItem<T, S> | LeafItem<T, S>;

export type JoinResult<T, S> = [Item<T, S>] | [Item<T, S>, Item<T, S>];

export type SeekResult<T, S, D> = {
  leaf: LeafItem<T, S> | null;
  start: D;
};