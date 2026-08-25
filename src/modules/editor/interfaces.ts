import { ItemType, TextSummary } from "./types";

export interface ISumTree<T, S> {
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

/**
 * An interface describing accumulation functions over a SumTree.
 * T is type of the node value, S is summary, 
 */
export interface TreeSpec<V, S> {
  default: () => S;
  summary: (value: V) => S;
  combine: (leftSumary: S, rightSummary: S) => S;
}