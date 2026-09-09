import { Internal, InternalItem } from "./item";
import { ISumTree } from "./interfaces";
import { TextSummary, TreeSpec } from "./types";

export class SumTree implements ISumTree {
  private _root: InternalItem;

  constructor(spec: TreeSpec<string, TextSummary>) {
    this._root = new Internal(spec);
  }

  open(fileName: string): void {
    
  }
}