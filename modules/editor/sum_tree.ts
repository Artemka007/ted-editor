import { TextSummary } from "./types";

/**
 * An interface describing accumulation functions over a SumTree.
 * T is type of the node, S is summary, Ctx is something 
 */
export interface TreeSpec<T, S> {
  default: () => S;
  summary: (item: T) => S;
  combine: (left: T, right: T) => S;
}

export class SumTree<T, S> {
  // private _root: T;
  private _spec: TreeSpec<T, S>;

  constructor(spec: TreeSpec<T, S>) {
    this._spec = spec;
  }
}