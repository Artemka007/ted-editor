import { ISumTree, TextSummary } from "./types";

import { ItemType } from "./enums";

export interface InternalItem {
  type: ItemType.INTERNAL;
  get height(): number;
  get childSummaries(): TextSummary[];
  get childTrees(): ISumTree<Item, TextSummary>[];
} 

export interface LeafItem {
  type: ItemType.LEAF;
  get summary(): TextSummary;
  get value(): string;
}

export type Item = InternalItem | LeafItem;

export class Internal implements InternalItem {
  type: ItemType.INTERNAL = ItemType.INTERNAL;

  get height(): number {
    return this._height;
  }
  get childSummaries(): TextSummary[] {
    return this._childSummaries;
  }
  get childTrees(): ISumTree<Item, TextSummary>[] {
    return this._childTrees;
  }
  
  private _height: number;
  private _childSummaries: TextSummary[];
  private _childTrees: ISumTree<Item, TextSummary>[];

  constructor(
    height: number = 0, 
    childSummaries: TextSummary[] = [], 
    childTrees: ISumTree<Item, TextSummary>[] = []
  ) {
    this._height = height;
    this._childSummaries = childSummaries;
    this._childTrees = childTrees;
  }
}

export class Leaf implements LeafItem {
  type: ItemType.LEAF = ItemType.LEAF;

  get summary() {
    return this._summary;
  }
  get value() {
    return this._value;
  };

  constructor(
    value: string, 
    summary: TextSummary , 
  ) {
    this._value = value;
    this._summary = summary;
  }

  private _value: string;
  private _summary: TextSummary;
}