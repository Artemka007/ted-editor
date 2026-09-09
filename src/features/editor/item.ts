import { TextSummary, TreeSpec } from "./types";

import { ItemType } from "./enums";
import { combineMultiple } from "./utils";

export interface InternalItem<T, S> {
  type: ItemType.INTERNAL;

  get height(): number;
  get childSummaries(): S[];
  get childTrees(): Item<T, S>[];
  get firstChild(): Item<T, S> | null;
  get lastChild(): Item<T, S> | null;
  get summary(): S;
  get empty(): boolean;
} 

export interface LeafItem<T, S> {
  type: ItemType.LEAF;

  get summary(): S;
  get value(): T;
  get height(): number;
  get empty(): boolean;
}

export type Item<T, S> = InternalItem<T, S> | LeafItem<T, S>;

export class Internal<T, S> implements InternalItem<T, S> {
  type: ItemType.INTERNAL = ItemType.INTERNAL;

  get height(): number {
    return this._height;
  }
  get childSummaries(): S[] {
    return this._childSummaries;
  }
  get childTrees(): Item<T, S>[] {
    return this._childTrees;
  }
  get lastChild(): Item<T, S> | null {
    return this._childTrees[this._childTrees.length - 1] ?? null;
  }
  get firstChild(): Item<T, S> | null {
    return this._childTrees[0] ?? null;
  }
  get summary(): S {
    return this._summary;
  }
  get empty(): boolean {
    return this._childTrees.length === 0;
  }
  
  private _height: number;
  private _childSummaries: S[];
  private _childTrees: Item<T, S>[];
  private _summary: S;

  constructor(
    spec: TreeSpec<T, S>,
    height: number = 0, 
    childTrees: Item<T, S>[] = []
  ) {
    this._height = height;
    this._childTrees = childTrees;
    this._childSummaries = childTrees.map(i => i.summary);
    this._summary = combineMultiple(spec, ...this._childSummaries);
  }
}

export class Leaf<T, S> implements LeafItem<T, S> {
  type: ItemType.LEAF = ItemType.LEAF;

  get summary() {
    return this._summary;
  }
  get value() {
    return this._value;
  };
  get height() {
    return 0;
  }
  get empty(): boolean {
    return String(this._value).length === 0;
  }

  constructor(
    value: T, 
    summary: S , 
  ) {
    this._value = value;
    this._summary = summary;
  }

  private _value: T;
  private _summary: S;
}