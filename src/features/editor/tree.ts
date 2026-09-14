import { Internal } from "./item";
import { InternalItem, ISumTree } from "./interfaces";
import { TextSummary, TreeSpec } from "./types";

export class SumTree<T, S> implements ISumTree<T, S> {
  private _root: InternalItem<T, S>;

  constructor(spec: TreeSpec<T, S>) {
    this._root = new Internal(spec);
  }

  open(fileName: string): void {
    
  }
}